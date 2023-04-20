export type Authorizer = {
    loggedIn: () => boolean;
}

const authorizer = ({ userId }: { userId?: string }):Authorizer => {
    return {
        loggedIn: () => !!userId
    };
}

export default authorizer