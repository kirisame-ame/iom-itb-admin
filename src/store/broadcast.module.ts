import ApiService from "./api.service";
import { ActionContext } from "vuex";
import type {
  ApiDataResponse,
  BroadcastLogsResponse,
  BroadcastRecipient,
  BroadcastRecipientPayload,
  BroadcastRunResponse,
  BroadcastSetting,
  BroadcastSettingPayload,
  RootState,
} from "@/types/domain";

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
export const PUT_BROADCAST_MEMBER = "putBroadcastMember";

interface State {
  settings: BroadcastSetting[];
  logs: BroadcastLogsResponse;
  members: BroadcastRecipient[];
}

const state: State = {
  settings: [],
  logs: { data: [], pagination: {} },
  members: [],
};

const getters = {
  broadcastSettings: (s: State): BroadcastSetting[] => s.settings,
  broadcastLogs: (s: State): BroadcastLogsResponse => s.logs,
  broadcastMembers: (s: State): BroadcastRecipient[] => s.members,
};

type Ctx = ActionContext<State, RootState>;

const actions = {
  [GET_BROADCAST_SETTINGS](ctx: Ctx): Promise<BroadcastSetting[]> {
    return ApiService.get<ApiDataResponse<BroadcastSetting[]>>("/broadcast/settings").then((res) => {
      ctx.commit(SET_BROADCAST_SETTINGS, res.data || []);
      return res.data || [];
    });
  },
  [POST_BROADCAST_SETTING](_ctx: Ctx, params: BroadcastSettingPayload): Promise<ApiDataResponse<BroadcastSetting>> {
    return ApiService.post<ApiDataResponse<BroadcastSetting>>("/broadcast/settings", params);
  },
  [PUT_BROADCAST_SETTING](_ctx: Ctx, params: { id: number; data: BroadcastSettingPayload }): Promise<ApiDataResponse<BroadcastSetting>> {
    return ApiService.put<ApiDataResponse<BroadcastSetting>>(`/broadcast/settings/${params.id}`, params.data);
  },
  [DELETE_BROADCAST_SETTING](_ctx: Ctx, id: number): Promise<{ message: string }> {
    return ApiService.delete<{ message: string }>(`/broadcast/settings/${id}`);
  },
  [RUN_BROADCAST](_ctx: Ctx, id: number): Promise<BroadcastRunResponse> {
    return ApiService.post<BroadcastRunResponse>(`/broadcast/run/${id}`, {});
  },
  [GET_BROADCAST_LOGS](ctx: Ctx, params: { settingId?: number; page?: number; limit?: number }): Promise<BroadcastLogsResponse> {
    return ApiService.get<BroadcastLogsResponse>("/broadcast/logs", params).then((res) => {
      ctx.commit(SET_BROADCAST_LOGS, res);
      return res;
    });
  },
  [GET_BROADCAST_MEMBERS](ctx: Ctx): Promise<BroadcastRecipient[]> {
    return ApiService.get<ApiDataResponse<BroadcastRecipient[]>>("/broadcast/members").then((res) => {
      ctx.commit(SET_BROADCAST_MEMBERS, res.data || []);
      return res.data || [];
    });
  },
  [POST_BROADCAST_MEMBER](_ctx: Ctx, params: BroadcastRecipientPayload): Promise<ApiDataResponse<BroadcastRecipient>> {
    return ApiService.post<ApiDataResponse<BroadcastRecipient>>("/broadcast/members", params);
  },
  [IMPORT_BROADCAST_MEMBERS](_ctx: Ctx, file: File): Promise<{ inserted: number; skipped: number; total: number }> {
    const fd = new FormData();
    fd.append("file", file);
    return ApiService.upload<{ inserted: number; skipped: number; total: number }>("/broadcast/members/import", fd);
  },
  [DELETE_BROADCAST_MEMBER](_ctx: Ctx, id: string): Promise<{ message: string }> {
    return ApiService.delete<{ message: string }>(`/broadcast/members/${id}`);
  },
  [PUT_BROADCAST_MEMBER](_ctx: Ctx, params: { id: string; data: BroadcastRecipientPayload }): Promise<ApiDataResponse<BroadcastRecipient>> {
    return ApiService.put<ApiDataResponse<BroadcastRecipient>>(`/broadcast/members/${params.id}`, params.data);
  },
};

const mutations = {
  [SET_BROADCAST_SETTINGS](s: State, data: BroadcastSetting[]): void {
    s.settings = data;
  },
  [SET_BROADCAST_LOGS](s: State, data: BroadcastLogsResponse): void {
    s.logs = data;
  },
  [SET_BROADCAST_MEMBERS](s: State, data: BroadcastRecipient[]): void {
    s.members = data;
  },
};

export default { state, getters, actions, mutations };
