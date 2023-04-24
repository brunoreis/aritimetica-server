import { UserDataType } from './UserDataType';
import { AuthorizerType } from './AuthorizerType';

const createAuthorizer = ({ loadUserData }: { loadUserData: () => Promise<UserDataType> }):AuthorizerType => {
    return {
        loggedIn: async () => {
            const userData = await loadUserData();
            return userData.uuid !== 'annonymous'
        }
    };
}

export default createAuthorizer