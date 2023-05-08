import { UserDataType } from '../UserDataType';

const cachedUserData = () => {
    let cachedData: { userUuid: string | null, data: UserDataType} | null = null;

    const get = (userUuid: string):UserDataType | null => {
        if(cachedData !== null) {
            const cachedDataNotNull = cachedData as Exclude<typeof cachedData, null>;
            if(cachedDataNotNull.userUuid == userUuid) {
                return cachedDataNotNull.data;
            }
        }
        return null
    }
    
    const store = (userData: UserDataType) => {
        cachedData = {
            userUuid: userData.uuid,
            data: userData
        }
    }

    return {
        get, store
    }

}

export { cachedUserData };