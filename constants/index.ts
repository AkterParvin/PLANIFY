export const headerLinks = [
    {
        label: 'Home',
        route: '/',
    },
    {
        label: 'Create Event',
        route: '/events/create',
    },
    {
        label: 'My Profile',
        route: '/profile',
    },
]
//This eventDefaultValues objects allows us to ensure consistency and avoid repetitive code when setting default values for event objects across different parts of our application. Additionally, if the default values need to be updated or changed later on, we can do it in one central place (eventDefaultValues constant) rather than modifying multiple instances throughout our codebase.

export const eventDefaultValues = {
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: '',
    price: '',
    isFree: false,
    url: '',
}