import { UserDataType } from './UserDataType';
import { AuthorizerType } from './AuthorizerType';

const createAuthorizer = ({ userData }: { userData: UserDataType }):AuthorizerType => {
    return {
        loggedIn: () => userData.uuid !== 'annonymous'
    };
}

export default createAuthorizer