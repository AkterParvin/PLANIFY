import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username!,
            firstName: first_name,
            lastName: last_name,
            photo: image_url,
        }
        const newUser = await createUser(user);
        if (newUser) {
            await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                    userId: newUser._id
                }
            })
        }
        return NextResponse.json({ message: "OK", user: newUser })
    }

    if (eventType === "user.updated") {
        const { id, image_url, first_name, last_name, username } = evt.data;
        const user = {
            username: username!,
            firstName: first_name,
            lastName: last_name,
            photo: image_url,
        };
        const updatedUser = await updateUser(id, user)

        return NextResponse.json({ message: "OK", user: updatedUser })
    }
    if (eventType === "user.deleted") {
        const { id } = evt.data;
        const deletedUser = await deleteUser(id!);
        return NextResponse.json({ message: "OK", user: deletedUser })
    }
    return new Response('', { status: 200 })
}









/*
In this code there is a function designed to handle incoming HTTP POST requests related to webhooks. It verifies the authenticity of the webhook using headers and a secret key, processes the payload, and performs specific actions based on the type of webhook event received. In this example, it checks if the webhook event is a "user.created" event, and if so, it extracts user information from the payload, creates a new user, and updates user metadata using the Clerk API. Finally, it returns an appropriate HTTP response.
/*



 /* a webhook is used to handle incoming HTTP POST requests. Webhooks are a way for one system to notify another system about events or updates in real-time. In this specific context, the webhook is employed to receive notifications from a service, possibly the Clerk service, regarding events related to user creation.

 Here's the breakdown of the process:

 Receiving Events in Real - time:

 The code sets up an HTTP endpoint(POST function) to receive webhook events.
 Verifying Webhook Authenticity:

 It verifies the authenticity of incoming webhook requests using a secret key (WEBHOOK_SECRET).This helps ensure that the incoming data is legitimate and originated from the expected source.
 Processing Webhook Payload:

 The code extracts information from the received payload, such as the event type, user details, etc.
 Handling Specific Event Types:

 In this case, the code checks if the received event type is "user.created." If it is, it extracts user information from the payload and performs actions like creating a new user and updating user metadata.
 Responding to Webhook:

 The code sends an appropriate response back, indicating the outcome of processing the webhook event.
Webhooks are commonly used in scenarios where real - time communication and event - driven updates are required between different systems or services.In this context, the webhook is likely used to keep track of user creation events and take specific actions based on those events, such as updating user information in a database.
*/