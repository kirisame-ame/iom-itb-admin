import ApiService from "./api.service";
import { ActionContext } from "vuex";

export const GET_ACTIVITIES = "getActivities";
export const SET_ACTIVITIES = "setActivities";
export const GET_ACTIVITY_BY_ID = "getActivityById";
export const SET_CURRENT_ACTIVITY = "setCurrentActivity";
export const POST_ACTIVITY = "postActivity";
export const PUT_ACTIVITY = "putActivity";
export const DELETE_ACTIVITY = "deleteActivity";
export const PUBLISH_ACTIVITY = "publishActivity";
export const GET_ACTIVITY_COUNTS = "getActivityCounts";


interface ActivityMedia {
  id?: number;
  type: 'image' | 'youtube';
  value: string;
  order: number;
  caption?: string;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  url: string;
  status: 'draft' | 'published';
  media: ActivityMedia[];
  createdAt: string;
  updatedAt: string;
}

interface State {
  activities: any;
  currentActivity: Activity | null;
}

const state: State = {
  activities: [],
  currentActivity: null,
};

const getters = {
  activities: (state: State) => state.activities,
  currentActivity: (state: State) => state.currentActivity,
};

type VuexContext = ActionContext<State, any>;

const actions = {
  [GET_ACTIVITIES](context: VuexContext, params: Record<string, any>): Promise<any> {
    return new Promise((resolve, reject) => {
      ApiService.get<any>("/activities", params)
        .then(response => {
          context.commit(SET_ACTIVITIES, response);
          resolve(response);
        })
        .catch(err => reject(err));
    });
  },

  [GET_ACTIVITY_BY_ID](context: VuexContext, id: number): Promise<Activity> {
    return new Promise((resolve, reject) => {
      ApiService.get<any>(`/activities/id/${id}`) // ubah dari /activities/${id}
        .then(response => {
          context.commit(SET_CURRENT_ACTIVITY, response.data);
          resolve(response.data);
        })
        .catch(err => reject(err));
    });
  },

  [POST_ACTIVITY](context: VuexContext, params: Record<string, any>): Promise<Activity> {
    return new Promise((resolve, reject) => {
      ApiService.post<any>("/activities", params.data)
        .then(({ data }: any) => resolve(data))
        .catch((err: any) => reject(err));
    });
  },

  [PUT_ACTIVITY](context: VuexContext, params: Record<string, any>): Promise<Activity> {
    return new Promise((resolve, reject) => {
      ApiService.put<any>(`/activities/${params.id}`, params.data)
        .then(({ data }: any) => resolve(data))
        .catch((err: any) => reject(err));
    });
  },

  [PUBLISH_ACTIVITY](context: VuexContext, id: number): Promise<Activity> {
    return new Promise((resolve, reject) => {
      ApiService.put<any>(`/activities/${id}`, { status: 'published' })
        .then(({ data }: any) => resolve(data))
        .catch((err: any) => reject(err));
    });
  },

  [DELETE_ACTIVITY](context: VuexContext, params: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/activities/${params.id}`)
        .then(() => resolve())
        .catch((err: any) => reject(err));
    });
  },

  [GET_ACTIVITY_COUNTS](context: VuexContext): Promise<any> {
    return new Promise((resolve, reject) => {
      ApiService.get<any>("/activities/counts")
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    });
  },
};

const mutations = {
  [SET_ACTIVITIES](state: State, data: any): void {
    state.activities = data;
  },
  [SET_CURRENT_ACTIVITY](state: State, data: Activity): void {
    state.currentActivity = data;
  },
};

export default { state, getters, actions, mutations };