type TData = Record<any, any> | Array<Record<any, any>>;

type TGenerateJSON = {
  code: number;
  message?: string;
  data?: TData;
};

export const generateJson = (args: TGenerateJSON): TGenerateJSON => {
  return args;
};
