import {
  Slide,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from "@suid/material";
import {
  JSXElement,
  Show,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import {
  NotesRounded,
  LogoutOutlined,
  HomeOutlined,
  CardMembershipOutlined,
  DeleteForeverOutlined,
} from "@suid/icons-material";
import { checkAuth } from "../auth_payments_landing/use_auth";
import { TransitionProps } from "@suid/material/transitions";
import EndSessionLogout from "./endsession_logout";
import { handleClickOpenEndGameSession } from "../game/end_game_session";
import { stripePortal } from "../auth_payments_landing/stripe_portal";
import DeleteAccount from "./delete_account";
import { useLocation, useNavigate } from "solid-app-router";
import { fetchSubStatus } from "../auth_payments_landing/user";
import LightsUp from "./lights_up";

const Transition = function Transition(
  props: TransitionProps & {
    children: JSXElement;
  }
) {
  return <Slide direction="down" {...props} />;
};

const dialogTextStyle = {
  color: "#f9fafb",
};

const BASE_API = import.meta.env.CO_API_URL;

export default function AccountMenu() {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [openLogout, setOpenLogout] = createSignal(false);
  const [openDeleteAccount, setOpenDeleteAccount] = createSignal(false);
  const location = useLocation();
  const [subscriptionStatus, { refetch: refetchSubStatus }] =
    createResource(fetchSubStatus);
  const navigate = useNavigate();

  //Logout
  const handleClickOpenLogout = () => {
    setOpenLogout(true);
  };
  const handleCloseLogout = () => {
    setOpenLogout(false);
  };

  //Delete Account
  const handleOpenDeleteAccount = () => {
    setOpenDeleteAccount(true);
  };
  const handleCloseDeleteAccount = () => {
    setOpenDeleteAccount(false);
  };

  const handleDashboardNavigate = () => {
    window.location.href = `/user`;
  };

  const handleNavigateRules = () => {
    window.location.href = `/rules`;
  };

  const handlePricingPlans = () => {
    window.location.href = `/user#pricingplans`;
  };

  const handlePlayGame = () => {
    window.location.href = `/game`;
  };

  const handleHome = () => {
    window.location.href = `/`;
  };

  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
  });

  onMount(() => {
    //refresh subscription status after 0.3 seconds
    setTimeout(() => {
      refetchSubStatus();
    }, 300);
  });

  return (
    <>
      <Show when={!subscriptionStatus() && !isAuthenticated()}>
        <Show when={location.pathname === "/"}>
          <div class="text-center    flex flex-row    mt-6 mb-24 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/30x30"
                alt="logo"
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <span class="transform -rotate-12 border-2 shadow-md shadow-gray-50 text-4xl hover:scale-105 transition-transform duration-300 uppercase tracking-[0.1em] bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 text-gray-100">
                Odd
              </span>
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200">
              <div class="flex flex-row items-center justify-center  text-xl">
                <a href="#howitworks">
                  <div class="px-4">How it Works</div>
                </a>
                <a href="#features">
                  <div class="px-4">Features</div>
                </a>
                <a href="#pricing-plans">
                  <div class="px-4">Pricing</div>
                </a>
              </div>
            </div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <a href={`${BASE_API}/login`}>
                    <div class="w-[60px] ">Log in</div>
                  </a>
                </div>
                <div>
                  <Button
                    variant="contained"
                    href={`${BASE_API}/login`}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Get Started
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
        <Show when={location.pathname !== "/" && location.pathname !== "/game"}>
          <div class="text-center    flex flex-row     mt-6   ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/30x30"
                alt="logo"
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <span class="transform -rotate-12 border-2 shadow-md shadow-gray-50 text-4xl hover:scale-105 transition-transform duration-300 uppercase tracking-[0.1em] bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 text-gray-100">
                Odd
              </span>
            </div>

            <div class="w-4/6 "></div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <a href={`${BASE_API}/login`} style={{ cursor: "pointer" }}>
                    <div class="w-[60px] ">Log in</div>
                  </a>
                </div>
                <div>
                  <Button
                    variant="contained"
                    href={`${BASE_API}/login`}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Get Started
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
        <Show when={location.pathname === "/game"}>
          <div class="text-center    flex flex-row     mt-6   ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/30x30"
                alt="logo"
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="w-4/6 "></div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <div
                    onClick={handleClickOpenEndGameSession}
                    style={{ cursor: "pointer" }}
                    class="w-[100px] "
                  >
                    End Game
                  </div>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="warning"
                    href={`${BASE_API}/login`}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    sign Up
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Show>

      {/* Authentication but not subbed */}
      <Show when={isAuthenticated() && !subscriptionStatus()}>
        <Show when={location.pathname !== "/game"}>
          <div class="text-center    flex flex-row    mt-6 mb-6 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/30x30"
                alt="logo"
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <span class="transform -rotate-12 border-2 shadow-md shadow-gray-50 text-4xl hover:scale-105 transition-transform duration-300 uppercase tracking-[0.1em] bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 text-gray-100">
                Odd
              </span>
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200">
              <div class="   cursor-pointer relative group w-44">
                <div
                  onClick={handleDashboardNavigate}
                  class="text-xl   text-white hover:bg-slate-700 p-2 flex items-center"
                >
                  <HomeOutlined class="mr-2" />
                  Dashboard
                </div>
                <div class="absolute w-44 left-0 top-full hidden group-hover:block bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md z-10">
                  <div
                    onClick={handleNavigateRules}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <NotesRounded class="mr-2" />
                    Rules
                  </div>
                  <div
                    onClick={handleOpenDeleteAccount}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <DeleteForeverOutlined class="mr-2" />
                    Delete Account
                  </div>
                  <div
                    onClick={handleClickOpenLogout}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <LogoutOutlined class="mr-2" />
                    Logout
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <Button
                  variant="contained"
                  onClick={handlePricingPlans}
                  sx={{
                    width: "150px",
                    height: "45px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Start Trial
                </Button>{" "}
              </div>
            </div>
          </div>
        </Show>
        <Show when={location.pathname === "/game"}>
          <div class="text-center    flex flex-row    mt-6 mb-6 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/30x30"
                alt="logo"
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200">
              <div class="   cursor-pointer relative group w-44">
                <div
                  onClick={handleDashboardNavigate}
                  class="text-xl   text-white hover:bg-slate-700 p-2 flex items-center"
                >
                  <HomeOutlined class="mr-2" />
                  Dashboard
                </div>
                <div class="absolute w-44 left-0 top-full hidden group-hover:block bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md z-10">
                  <div
                    onClick={handleNavigateRules}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <NotesRounded class="mr-2" />
                    Rules
                  </div>
                  <div
                    onClick={handleOpenDeleteAccount}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <DeleteForeverOutlined class="mr-2" />
                    Delete Account
                  </div>
                  <div
                    onClick={handleClickOpenLogout}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <LogoutOutlined class="mr-2" />
                    Logout
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <a
                    onClick={handleClickOpenEndGameSession}
                    style={{ cursor: "pointer" }}
                  >
                    <div class="w-[100px] ">End Game</div>
                  </a>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="warning"
                    href={`${BASE_API}/login`}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Start Trial
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Show>

      {/* Authentication but not subbed */}
      <Show when={isAuthenticated() && subscriptionStatus()}>
        <Show when={location.pathname !== "/game"}>
          <div class="text-center    flex flex-row    mt-6 mb-6 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/30x30"
                alt="logo"
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <span class="transform -rotate-12 border-2 shadow-md shadow-gray-50 text-4xl hover:scale-105 transition-transform duration-300 uppercase tracking-[0.1em] bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 text-gray-100">
                Odd
              </span>
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200">
              <div class="   cursor-pointer relative group w-44">
                <div
                  onClick={handleDashboardNavigate}
                  class="text-xl   text-white hover:bg-slate-700 p-2 flex items-center"
                >
                  <HomeOutlined class="mr-2" />
                  Dashboard
                </div>
                <div class="absolute w-44 left-0 top-full hidden group-hover:block bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md z-10">
                  <div
                    onClick={handleNavigateRules}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <NotesRounded class="mr-2" />
                    Rules
                  </div>
                  <div
                    onClick={stripePortal}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <CardMembershipOutlined class="mr-2" />
                    Subscription
                  </div>
                  <div
                    onClick={handleOpenDeleteAccount}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <DeleteForeverOutlined class="mr-2" />
                    Delete Account
                  </div>
                  <div
                    onClick={handleClickOpenLogout}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <LogoutOutlined class="mr-2" />
                    Logout
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <Button
                  variant="contained"
                  onClick={handlePlayGame}
                  sx={{
                    width: "150px",
                    height: "45px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Play Game
                </Button>{" "}
              </div>
            </div>
          </div>
        </Show>
        <Show when={location.pathname === "/game"}>
          <div class="text-center    flex flex-row    mt-6 mb-6 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/30x30"
                alt="logo"
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200">
              <div class="   cursor-pointer relative group w-44">
                <div
                  onClick={handleDashboardNavigate}
                  class="text-xl   text-white hover:bg-slate-700 p-2 flex items-center"
                >
                  <HomeOutlined class="mr-2" />
                  Dashboard
                </div>
                <div class="absolute w-44 left-0 top-full hidden group-hover:block bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md z-10">
                  <div
                    onClick={handleNavigateRules}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <NotesRounded class="mr-2" />
                    Rules
                  </div>
                  <div
                    onClick={stripePortal}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <CardMembershipOutlined class="mr-2" />
                    Subscription
                  </div>
                  <div
                    onClick={handleOpenDeleteAccount}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <DeleteForeverOutlined class="mr-2" />
                    Delete Account
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <a
                    onClick={handleClickOpenEndGameSession}
                    style={{ cursor: "pointer" }}
                  >
                    <div class="w-[150px] ">End Session</div>
                  </a>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleClickOpenLogout}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Logout
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Show>

      <Dialog
        open={openLogout()}
        TransitionComponent={Transition}
        onClose={handleCloseLogout}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <Show when={subscriptionStatus() || isAuthenticated}>
          <div class="flex flex-col justify-center items-center">
            <div>
              <DialogContent style={dialogTextStyle}>
                <DialogTitle
                  class="flex justify-center items-center"
                  style={dialogTextStyle}
                >
                  End Session and Logout
                </DialogTitle>
                <DialogContentText
                  id="alert-dialog-slide-description"
                  style={dialogTextStyle}
                >
                  Are you sure you want to end the session and logout? All game
                  data will be deleted.
                </DialogContentText>
              </DialogContent>
            </div>
            <div>
              <EndSessionLogout />
            </div>
          </div>
          <DialogActions style={dialogTextStyle}>
            <Button onClick={handleCloseLogout} style={dialogTextStyle}>
              Cancel
            </Button>
          </DialogActions>
        </Show>
      </Dialog>
      {/* Delete Account Dialog */}
      <Dialog
        open={openDeleteAccount()}
        TransitionComponent={Transition}
        onClose={handleCloseDeleteAccount}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <Show when={isAuthenticated}>
          <div class="flex flex-col justify-center items-center">
            <div>
              <DialogContent style={dialogTextStyle}>
                <DialogTitle
                  class="flex justify-center items-center"
                  style={dialogTextStyle}
                >
                  ⚠️⚠️ Delete Account Forever ⚠️⚠️
                </DialogTitle>
                <DialogContentText
                  id="alert-dialog-slide-description"
                  style={dialogTextStyle}
                >
                  You will no longer have access to your account and all data
                  will be permanently deleted.
                </DialogContentText>
              </DialogContent>
            </div>
            <div class="flex justify-center items-center">
              <DeleteAccount />
            </div>
          </div>
          <DialogActions style={dialogTextStyle}>
            <Button onClick={handleCloseDeleteAccount} style={dialogTextStyle}>
              Cancel
            </Button>
          </DialogActions>
        </Show>
      </Dialog>
    </>
  );
}
