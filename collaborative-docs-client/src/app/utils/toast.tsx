import { toast, ToastOptions } from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

const ToastContent = ({
  message,
  type,
  visible,
}: {
  message: string;
  type: ToastType;
  visible: boolean;
}) => {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-white font-medium
        shadow-lg
        transform transition-all duration-300 ease-in-out
        ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95"
        }
        ${type === "success" && "bg-emerald-600"}
        ${type === "error" && "bg-red-600"}
        ${type === "loading" && "bg-slate-800"}
      `}
    >
      {type === "loading" && <span className="animate-spin">⏳</span>}
      {type === "success" && "✅"}
      {type === "error" && "❌"}
      <span>{message}</span>
    </div>
  );
};

const baseOptions: ToastOptions = {
  position: "top-right",
};

export const toastPromise = async <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err) => string);
  }
): Promise<T> => {
  const id = toast.custom(
    (t) => (
      <ToastContent
        visible={t.visible}
        type="loading"
        message={messages.loading}
      />
    ),
    { ...baseOptions, duration: Infinity }
  );

  try {
    const result = await promise;

    toast.custom(
      (t) => (
        <ToastContent
          visible={t.visible}
          type="success"
          message={
            typeof messages.success === "function"
              ? messages.success(result)
              : messages.success
          }
        />
      ),
      { ...baseOptions, id, duration: 3000 }
    );

    return result;
  } catch (err) {
    toast.custom(
      (t) => (
        <ToastContent
          visible={t.visible}
          type="error"
          message={
            typeof messages.error === "function"
              ? messages.error(err)
              : messages.error
          }
        />
      ),
      { ...baseOptions, id, duration: 4000 }
    );

    throw err;
  }
};
