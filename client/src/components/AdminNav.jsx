import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

const AdminNav = () => {
  const { handleLogout, user } = useAuth();
  // pathname
  console.log(user)
  const pathname = window.location.pathname;
  

  return (
    <>
      <div className="bg-myorange h-[85px] px-8 items-center max-w-full mx-auto text-white flex justify-between  top-0">
        {user ? (
          <div className="flex flex-1 text-xl text-bolder">
            {user?.name}
            <span className="mx-3">|</span>
            <span className="capitalize">{user?.type}</span>
            <span>
              {user?.additionalData && (
                <>
                  :<span className="ml-3">{user?.additionalData?.name}</span>
                  <span className="mx-3">|</span>
                </>
              )}
            </span>
            id:
            <button
              title="click to copy id to clipboard"
              className="cursor-pointer hover:underline ml-2"
              onClick={() => {
                navigator.clipboard.writeText(user?._id);
                toast.success("ID Copied to clipboard", {
                  position: "top-center",
                  autoClose: 3000,
                  closeOnClick: true,
                  draggable: true,
                });
              }}
            >
              {user?._id}
            </button>
            <div className="ml-5 capitalize">
              Level: {user?.compensationLevel.replace("_", " ")}
            </div>
          </div>
        ) : (
          <span></span>
        )}
        <div className="flex items-center gap-6">
          {user?.type !== "member" && !pathname.includes("/user") && (
            <AddPaymentMethodModal />
          )}
          {user?.type !== "member" && pathname.includes("/user") && (
            <a
              className="text-lg font-bold hover:bg-orange-800 hover:bg-opacity-20 py-2 px-4 rounded-lg cursor-pointer"
              href={user?.type === "team" ? "/team" : "/company"}
            >
              {user?.type === "team" ? "Team Dashboard" : "Company Dashboard"}
            </a>
          )}

          {user?.type !== "member" && !pathname.includes("/user") && (
            <a
              className="text-lg font-bold hover:bg-orange-800 hover:bg-opacity-20 py-2 px-4 rounded-lg cursor-pointer"
              href="/user"
            >
              User Dashboard
            </a>
          )}

          <button
            className="text-lg font-bold hover:bg-orange-800 hover:bg-opacity-20 py-2 px-4 rounded-lg cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>

          
        </div>
      </div>
    </>
  );
};

export default AdminNav;
