import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Modal,
  ListItem,
  List,
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
  createSignal,
  onMount,
} from "solid-js";
import {
  PlayCircleOutlineOutlined,
  PolicyOutlined,
  Settings,
  SecurityRounded,
  NotesRounded,
  PersonPinOutlined,
  LogoutOutlined,
  CancelOutlined,
  HomeOutlined,
  CardMembershipOutlined,
  PeopleAltOutlined,
  EmailOutlined,
} from "@suid/icons-material";
import useTheme from "@suid/material/styles/useTheme";
import { userSubstatus } from "../auth_payments_landing/subscription_status";
import { checkAuth } from "../auth_payments_landing/use_auth";
import { TransitionProps } from "@suid/material/transitions";
import EndSessionLogout from "./endsession_logout";
import { handleClickOpenEndGameSession } from "../game/end_game_session";
import { stripePortal } from "../auth_payments_landing/stripe_portal";

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

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [openLogout, setOpenLogout] = createSignal(false);
  const [onGamePage, setOnGamePage] = createSignal(false);

  const theme = useTheme();

  //Menu
  const open = () => Boolean(anchorEl());
  const handleClose = () => setAnchorEl(null);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //Logout
  const handleClickOpenLogout = () => {
    setOpenLogout(true);
  };
  const handleCloseLogout = () => {
    setOpenLogout(false);
  };

  const handleDashboardNavigate = () => {
    if (isAuthenticated()) {
      window.open("/user", "_blank");
    } else {
      window.open("/", "_blank");
    }
  };

  const handleCommunitySupport = () => {
    window.open("https://www.reddit.com/r/commonlyodd/", "_blank");
  };

  const handleContactUs = () => {
    window.open("/contact-us", "_blank");
  };

  const handlePrivacyPolicy = () => {
    window.open("/privacy-policy", "_blank");
  };

  const handleTermsOfUse = () => {
    window.open("/terms-of-use", "_blank");
  };

  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
  });

  onMount(() => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    if (path === "/game" || urlParams.has("session")) {
      setOnGamePage(true);
    }
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <IconButton
          title="Account settings"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open() ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open() ? "true" : undefined}
          style={{
            color: "#f4f4f5",
            "font-weight": "bold",
            "text-align": "center",
          }}
        >
          <Settings fontSize="medium" />
        </IconButton>
      </Box>
      <Show when={isAuthenticated() && userSubstatus()}>
        <Menu
          anchorEl={anchorEl()}
          id="account-menu"
          open={open()}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              backgroundImage:
                "linear-gradient(to right, #0f172a, #09090b, #0f172a)",

              overflow: "visible",

              mt: 1.5,
              ["& .MuiAvatar-root"]: {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                zIndex: 0,
              },
              "& .MuiMenuItem-root": {
                minHeight: "24px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              },
            },
          }}
          style={dialogTextStyle}
        >
          <MenuItem onClick={handleDashboardNavigate} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <HomeOutlined />
            </ListItemIcon>
            <Typography variant="body1">Dashboard</Typography>
          </MenuItem>
          <MenuItem onClick={handleModalOpen} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <NotesRounded />
            </ListItemIcon>
            <Typography variant="body1">Rules</Typography>
          </MenuItem>{" "}
          <MenuItem style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PlayCircleOutlineOutlined />
            </ListItemIcon>
            <Typography variant="body1">Rules (video)</Typography>
          </MenuItem>
          <MenuItem onClick={handleCommunitySupport} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PeopleAltOutlined />
            </ListItemIcon>
            <Typography variant="body1">Community Support</Typography>
          </MenuItem>
          <MenuItem style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PolicyOutlined />
            </ListItemIcon>
            <Typography variant="body1"> Terms of Use</Typography>
          </MenuItem>
          <MenuItem style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <SecurityRounded />
            </ListItemIcon>
            <Typography variant="body1"> Privacy Policy</Typography>
          </MenuItem>
          <MenuItem onClick={handleContactUs} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <EmailOutlined />
            </ListItemIcon>
            <Typography variant="body1">Contact Us</Typography>
          </MenuItem>
          <MenuItem onClick={stripePortal} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <CardMembershipOutlined />
            </ListItemIcon>
            <Typography variant="body1">Manage Subscription</Typography>
          </MenuItem>
          <Show when={onGamePage()}>
            <MenuItem
              onClick={handleClickOpenEndGameSession}
              style={dialogTextStyle}
            >
              <ListItemIcon style={dialogTextStyle}>
                <CancelOutlined />
              </ListItemIcon>
              <Typography variant="body1"> End Session</Typography>
            </MenuItem>
          </Show>
          <Divider sx={{ borderColor: "#f9fafb" }} />
          <MenuItem onClick={handleClickOpenLogout} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>
            <Typography variant="body1">Logout</Typography>
          </MenuItem>
        </Menu>
      </Show>
      <Show when={!userSubstatus() && !isAuthenticated()}>
        <Menu
          anchorEl={anchorEl()}
          id="account-menu"
          open={open()}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              backgroundImage:
                "linear-gradient(to right, #0f172a, #09090b, #0f172a)",

              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",

              mt: 1.5,
              ["& .MuiAvatar-root"]: {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                zIndex: 0,
              },
              "& .MuiMenuItem-root": {
                minHeight: "24px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              },
            },
          }}
        >
          <MenuItem onClick={handleDashboardNavigate} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <HomeOutlined />
            </ListItemIcon>
            <Typography variant="body1">Dashboard</Typography>
          </MenuItem>
          <MenuItem onClick={handleModalOpen} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <NotesRounded />
            </ListItemIcon>
            <Typography variant="body1">Rules</Typography>
          </MenuItem>
          <MenuItem style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PlayCircleOutlineOutlined />
            </ListItemIcon>
            <Typography variant="body1">Rules (video)</Typography>
          </MenuItem>
          <MenuItem onClick={handleCommunitySupport} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PeopleAltOutlined />
            </ListItemIcon>
            <Typography variant="body1">Community Support</Typography>
          </MenuItem>
          <MenuItem style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PolicyOutlined />
            </ListItemIcon>
            <Typography variant="body1"> Terms of Use</Typography>
          </MenuItem>
          <MenuItem style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <SecurityRounded />
            </ListItemIcon>
            <Typography variant="body1"> Privacy Policy</Typography>
          </MenuItem>
          <MenuItem onClick={handleContactUs} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <EmailOutlined />
            </ListItemIcon>
            <Typography variant="body1">Contact Us</Typography>
          </MenuItem>

          <Divider sx={{ borderColor: "#f9fafb" }} />
          <Show when={onGamePage()}>
            <MenuItem
              onClick={handleClickOpenEndGameSession}
              style={dialogTextStyle}
            >
              <ListItemIcon style={dialogTextStyle}>
                <CancelOutlined />
              </ListItemIcon>
              <Typography variant="body1"> End Game</Typography>
            </MenuItem>
          </Show>
        </Menu>
      </Show>
      {/* Authorized but not subbed */}

      <Show when={isAuthenticated() && !userSubstatus()}>
        <Menu
          anchorEl={anchorEl()}
          id="account-menu"
          open={open()}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              backgroundImage:
                "linear-gradient(to right, #0f172a, #09090b, #0f172a)",

              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",

              mt: 1.5,
              ["& .MuiAvatar-root"]: {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                zIndex: 0,
              },
              "& .MuiMenuItem-root": {
                minHeight: "24px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              },
            },
          }}
        >
          <MenuItem onClick={handleDashboardNavigate} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <HomeOutlined />
            </ListItemIcon>
            <Typography variant="body1">Dashboard</Typography>
          </MenuItem>
          <MenuItem onClick={handleModalOpen} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <NotesRounded />
            </ListItemIcon>
            <Typography variant="body1">Rules</Typography>
          </MenuItem>{" "}
          <MenuItem style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PlayCircleOutlineOutlined />
            </ListItemIcon>
            <Typography variant="body1">Rules (video)</Typography>
          </MenuItem>
          <MenuItem onClick={handleCommunitySupport} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PeopleAltOutlined />
            </ListItemIcon>
            <Typography variant="body1">Community Support</Typography>
          </MenuItem>
          <MenuItem onClick={handleTermsOfUse} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <PolicyOutlined />
            </ListItemIcon>
            <Typography variant="body1"> Terms of Use</Typography>
          </MenuItem>
          <MenuItem onClick={handlePrivacyPolicy} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <SecurityRounded />
            </ListItemIcon>
            <Typography variant="body1"> Privacy Policy</Typography>
          </MenuItem>
          <MenuItem onClick={handleContactUs} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <EmailOutlined />
            </ListItemIcon>
            <Typography variant="body1">Contact Us</Typography>
          </MenuItem>
          <MenuItem onClick={stripePortal} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <CardMembershipOutlined />
            </ListItemIcon>
            <Typography variant="body1">Manage Subscription</Typography>
          </MenuItem>
          <Show when={onGamePage()}>
            <MenuItem
              onClick={handleClickOpenEndGameSession}
              style={dialogTextStyle}
            >
              <ListItemIcon style={dialogTextStyle}>
                <CancelOutlined />
              </ListItemIcon>
              <Typography variant="body1"> End Game</Typography>
            </MenuItem>
          </Show>
          <Divider sx={{ borderColor: "#f9fafb" }} />
          <MenuItem onClick={handleClickOpenLogout} style={dialogTextStyle}>
            <ListItemIcon style={dialogTextStyle}>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>
            <Typography variant="body1">Logout</Typography>
          </MenuItem>
        </Menu>
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
        <Show when={userSubstatus() || isAuthenticated}>
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
                  Are you sure you want to{" "}
                  <span class="text-error-700"> end</span> the session and
                  logout? All game data will be deleted.
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
      <Modal
        open={modalOpen()}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={dialogTextStyle}
      >
        <Box
          sx={{
            position: "absolute",
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "scroll",
            display: "block",
            boxShadow: 24,
            marginTop: "5px",
            paddingRight: "5px",
            paddingTop: "5px",
            paddingLeft: "5px",
            border: "1px solid #cbd5e1",
            "&::-webkit-scrollbar": {
              width: 5,
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 3,
            },
          }}
          class="w-10/12 h-1/2 lg:w-1/2 lg:h-1/2"
        >
          <Typography
            sx={{
              fontWeight: "bold",
            }}
            variant="h5"
            component="h2"
            class="text-center"
            style={dialogTextStyle}
          >
            Game Rules
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={dialogTextStyle}
          >
            Commonly Odd is trivia game that can be played by a single player or
            a group (up to 10 teams)
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={dialogTextStyle}
          >
            Each team goes one by one in a round robin style.
          </Typography>

          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={dialogTextStyle}
          >
            Players are presented with three items per round. The team must
            correctly determine which of three items is the outlier and the
            commonality shared by the other two. Each round is time-limited to
            15 seconds.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
            class="text-center"
            style={dialogTextStyle}
          >
            Setting Up the Game
          </Typography>

          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Session Creation: </span>A designated
              individual, the session starter, sets up the game session. They
              select the number of participating teams (up to 10) and the total
              score goal (up to 30).
            </ListItem>
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Link Distribution: </span>A unique session
              link is generated for sharing with other players.
            </ListItem>
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Game Commencement: </span>The session
              starter initiates the game once all players are on the same game
              session link.
            </ListItem>
          </List>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
            class="text-center"
            style={dialogTextStyle}
          >
            Scoring Points
          </Typography>

          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">2: </span>Awarded for correctly
              identifying the outlier and its exact reasoning.
            </ListItem>
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">1.5: </span>Given for correctly
              identifying the outlier and partially correct reasoning.
            </ListItem>
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">1: </span>For partial correctness, either
              in identifying the outlier or reasoning.
            </ListItem>
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">0: </span>For incorrect guesses or no
              response.
            </ListItem>
          </List>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
            class="text-center"
            style={dialogTextStyle}
          >
            Winning the Game
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
            }}
            style={dialogTextStyle}
          >
            The game is won by the first team to meet or exceed the target
            score. Post-game, the session starter can launch a new game or end
            the session.{" "}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
            class="text-center"
            style={dialogTextStyle}
          >
            Gameplay
          </Typography>

          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Session Starter's Role: </span>Controls
              game flow, including question selection, answer reveals, and
              scorekeeping.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Time Constraint: </span>Teams have a
              15-second window per round for decision-making.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Answer Revelation: </span>The session
              starter reveals the correct answers after each round.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Scoring System: </span>Points are awarded
              based on accuracy.
            </ListItem>
          </List>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
            class="text-center"
            style={dialogTextStyle}
          >
            Terminology
          </Typography>

          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Session Starter: </span>The individual
              responsible for initiating and managing the game session.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Session Link: </span>A unique URL used by
              players to join the game session.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Outlier Object: </span>The object that
              differs from the other two in the presented trio.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Commonality: </span>The shared attribute
              or connection between two of the objects.
            </ListItem>
          </List>

          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Game Session: </span>The period from the
              start of the game until it ends or a new game begins.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Time Limit: </span>Each decision-making
              round is restricted to 15 seconds.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Sportsmanship: </span>Players are
              encouraged to maintain a friendly and respectful environment
              during gameplay.
            </ListItem>
          </List>
          <List
            sx={{ listStyleType: "disc", marginLeft: "20px" }}
            style={dialogTextStyle}
          >
            <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
              <span class="font-bold">Game Commencement: </span>The start of the
              game, initiated by the session starter.
            </ListItem>
          </List>
        </Box>
      </Modal>
    </>
  );
}
