import ApiService from "./api.service";
import { ActionContext } from "vuex";

export const GET_TRANSACTIONS = "getTransactions";
export const SET_TRANSACTIONS = "setTransactions";
export const POST_TRANSACTION = "postTransaction";
export const PUT_TRANSACTION = "putTransaction";
export const DELETE_TRANSACTION = "deleteTransaction";

// Define type for transaction
interface Transaction {
    id: number; // Use appropriate type for transaction ID
    code: string; // Transaction code
    publicToken?: string; // Public order status token
    username: string; // User's name associated with the transaction
    email: string; // User's email
    noTelp: string; // User's phone number
    address: string; // User's address
    merchandiseId: number; // Related merchandise ID
    qty: number; // Quantity of merchandise
    payment: string | null; // Payment image path or null
    paymentMethod?: "manual" | "midtrans";
    paymentStatus?: "pending" | "settlement" | "expired" | "failed" | "refunded";
    midtransOrderId?: string | null;
    midtransTransactionId?: string | null;
    paymentType?: string | null;
    status: string; // Current status of the transaction (e.g., waiting, completed)
    createdAt?: string;
    updatedAt?: string;
}

interface Pagination {
    currentPage?: number;
    totalPages?: number;
    start?: number;
    end?: number;
    totalEntries?: number;
}

interface TransactionListResponse {
    data?: Transaction[];
    pagination?: Pagination;
}

// Define type for state
interface State {
    transactions: Transaction[];
    transactionPagination: Pagination;
}

// Define initial state
const state: State = {
    transactions: [],
    transactionPagination: {},
};

// Define getters
const getters = {
    transactions(state: State): Transaction[] {
        return state.transactions; // Return transaction data
    },
    transactionPagination(state: State): Pagination {
        return state.transactionPagination;
    },
};

// Define VuexContext type
type VuexContext = ActionContext<State, any>;

const actions = {
    [GET_TRANSACTIONS](context: VuexContext, params: Record<string, any>): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            ApiService.get<TransactionListResponse>("/transactions", params.data)
                .then(response => {
                    context.commit(SET_TRANSACTIONS, response);
                    resolve(response.data || []);
                })
                .catch(err => {
                    console.error("Error fetching transactions:", err);
                    reject(err);
                });
        });
    },
    [POST_TRANSACTION](context: VuexContext, params: Record<string, any>): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            ApiService.post<{ data: Transaction[] }>("/transactions", params.data)
                .then(({ data }) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    [PUT_TRANSACTION](context: VuexContext, params: Record<string, any>): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            ApiService.put<{ data: Transaction[] }>(`/transactions/${params.id}`, params.data)
                .then(({ data }) => resolve(data))
                .catch((err) => {
                    reject(err);
                });
        });
    },
    [DELETE_TRANSACTION](context: VuexContext, params: Record<string, any>): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.delete(`/transactions/${params.id}`)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};

const mutations = {
    [SET_TRANSACTIONS](state: State, response: TransactionListResponse | Transaction[]): void {
        if (Array.isArray(response)) {
            state.transactions = response;
            state.transactionPagination = {};
            return;
        }

        state.transactions = response.data || [];
        state.transactionPagination = response.pagination || {};
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
