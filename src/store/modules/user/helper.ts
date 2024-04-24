import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  avatar?: string
  name?: string
  description?: string
  orgName?: string
  nickName?: string
  account: string
  loginPhone: string
  headPic?: string
  headPicUrl?: string
  regTime?: string
  status?: number
  type?: number | string
  canBindNumber?: string
}

export interface UserState {
  userInfo: UserInfo
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      avatar: '',
      name: '',
      description: '',
      orgName: '',
      nickName: '',
      account: '',
      loginPhone: '',
      headPic: '',
      regTime: '',
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
