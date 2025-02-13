export function load({cookies}){
    return {authToken : cookies.get('authToken')};
}

export const actions = {
    register: async ({request,cookies}) => {
        
    }
}