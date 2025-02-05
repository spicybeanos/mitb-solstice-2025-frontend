

export function load({cookies}){
    return {authToken : cookies.get('authToken')};
}