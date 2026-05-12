import ApiService from "./api.service";
import { ActionContext } from "vuex";

export const GET_BROADCAST_SETTINGS = "getBroadcastSettings";
export const SET_BROADCAST_SETTINGS = "setBroadcastSettings";
export const POST_BROADCAST_SETTING = "postBroadcastSetting";
export const PUT_BROADCAST_SETTING = "putBroadcastSetting";
export const DELETE_BROADCAST_SETTING = "deleteBroadcastSetting";
export const RUN_BROADCAST = "runBroadcast";
export const GET_BROADCAST_LOGS = "getBroadcastLogs";
export const SET_BROADCAST_LOGS = "setBroadcastLogs";
export const GET_BROADCAST_MEMBERS = "getBroadcastMembers";
export const SET_BROADCAST_MEMBERS = "setBroadcastMembers";
export const POST_BROADCAST_MEMBER = "postBroadcastMember";
export const IMPORT_BROADCAST_MEMBERS = "importBroadcastMembers";
export const DELETE_BROADCAST_MEMBER = "deleteBroadcastMember";

interface State {
  settings: any[];
  logs: any;
  members: any[];
}

const state: State = {
  settings: [],
  logs: { data: [], pagination: {} },
  members: [],
};

const getters = {
  broadcastSettings: (s: State) => s.settings,
  broadcastLogs: (s: State) => s.logs,
  broadcastMembers: (s: State) => s.members,
};

type Ctx = ActionContext<State, any>;

const actions = {
  [GET_BROADCAST_SETTINGS](ctx: Ctx): Promise<any> {
    return ApiService.get<any>("/broadcast/settings").then((res: any) => {
      ctx.commit(SET_BROADCAST_SETTINGS, res.data || []);
    });
  },
  [POST_BROADCAST_SETTING](_ctx: Ctx, params: object): Promise<any> {
    return ApiService.post<any>("/broadcast/settings", params);
  },
  [PUT_BROADCAST_SETTING](_ctx: Ctx, params: { id: number; data: object }): Promise<any> {
    return ApiService.put<any>(`/broadcast/settings/${params.id}`, params.data);
  },
  [DELETE_BROADCAST_SETTING](_ctx: Ctx, id: number): Promise<any> {
    return ApiService.delete<any>(`broadcast/settings/${id}`);
  },
  [RUN_BROADCAST](_ctx: Ctx, id: number): Promise<any> {
    return ApiService.post<any>(`/broadcast/run/${id}`, {});
  },
  [GET_BROADCAST_LOGS](ctx: Ctx, params: { settingId?: number; page?: number; limit?: number }): Promise<any> {
    return ApiService.get<any>("/broadcast/logs", params as any).then((res: any) => {
      ctx.commit(SET_BROADCAST_LOGS, res);
    });
  },
  [GET_BROADCAST_MEMBERS](ctx: Ctx): Promise<any> {
    return ApiService.get<any>("/broadcast/members").then((res: any) => {
      ctx.commit(SET_BROADCAST_MEMBERS, res.data || []);
    });
  },
  [POST_BROADCAST_MEMBER](_ctx: Ctx, params: object): Promise<any> {
    return ApiService.post<any>("/broadcast/members", params);
  },
  [IMPORT_BROADCAST_MEMBERS](_ctx: Ctx, file: File): Promise<any> {
    const fd = new FormData();
    fd.append("file", file);
    return ApiService.upload<any>("/broadcast/members/import", fd as any);
  },
  [DELETE_BROADCAST_MEMBER](_ctx: Ctx, id: number): Promise<any> {
    return ApiService.delete<any>(`/broadcast/members/${id}`);
  },
};

const mutations = {
  [SET_BROADCAST_SETTINGS](s: State, data: any[]): void {
    s.settings = data;
  },
  [SET_BROADCAST_LOGS](s: State, data: any): void {
    s.logs = data;
  },
  [SET_BROADCAST_MEMBERS](s: State, data: any[]): void {
    s.members = data;
  },
};

export default { state, getters, actions, mutations };
