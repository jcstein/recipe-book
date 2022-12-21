/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "recipes.recipes";

export interface MsgCreateRecipe {
  creator: string;
  dish: string;
  ingredients: string;
}

export interface MsgCreateRecipeResponse {
  id: number;
}

function createBaseMsgCreateRecipe(): MsgCreateRecipe {
  return { creator: "", dish: "", ingredients: "" };
}

export const MsgCreateRecipe = {
  encode(message: MsgCreateRecipe, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.dish !== "") {
      writer.uint32(18).string(message.dish);
    }
    if (message.ingredients !== "") {
      writer.uint32(26).string(message.ingredients);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateRecipe {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateRecipe();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.dish = reader.string();
          break;
        case 3:
          message.ingredients = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateRecipe {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      dish: isSet(object.dish) ? String(object.dish) : "",
      ingredients: isSet(object.ingredients) ? String(object.ingredients) : "",
    };
  },

  toJSON(message: MsgCreateRecipe): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.dish !== undefined && (obj.dish = message.dish);
    message.ingredients !== undefined && (obj.ingredients = message.ingredients);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateRecipe>, I>>(object: I): MsgCreateRecipe {
    const message = createBaseMsgCreateRecipe();
    message.creator = object.creator ?? "";
    message.dish = object.dish ?? "";
    message.ingredients = object.ingredients ?? "";
    return message;
  },
};

function createBaseMsgCreateRecipeResponse(): MsgCreateRecipeResponse {
  return { id: 0 };
}

export const MsgCreateRecipeResponse = {
  encode(message: MsgCreateRecipeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateRecipeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateRecipeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateRecipeResponse {
    return { id: isSet(object.id) ? Number(object.id) : 0 };
  },

  toJSON(message: MsgCreateRecipeResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateRecipeResponse>, I>>(object: I): MsgCreateRecipeResponse {
    const message = createBaseMsgCreateRecipeResponse();
    message.id = object.id ?? 0;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /** this line is used by starport scaffolding # proto/tx/rpc */
  CreateRecipe(request: MsgCreateRecipe): Promise<MsgCreateRecipeResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.CreateRecipe = this.CreateRecipe.bind(this);
  }
  CreateRecipe(request: MsgCreateRecipe): Promise<MsgCreateRecipeResponse> {
    const data = MsgCreateRecipe.encode(request).finish();
    const promise = this.rpc.request("recipes.recipes.Msg", "CreateRecipe", data);
    return promise.then((data) => MsgCreateRecipeResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
