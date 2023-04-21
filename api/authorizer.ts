import { UserDataType } from './UserDataType';
export type Authorizer = {
    loggedIn: () => boolean;
}

const authorizer = ({ userData }: { userData: UserDataType }):Authorizer => {
    return {
        loggedIn: () => userData.id !== 'annonymous'
    };
}

export default authorizer