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
} from "@suid/icons-material";
import useTheme from "@suid/material/styles/useTheme";
import {
  checkSubStatus,
  userSubstatus,
} from "../auth_payments_landing/subscription_status";
import { checkAuth } from "../auth_payments_landing/use_auth";
import { TransitionProps } from "@suid/material/transitions";
import EndSessionLogout from "./endsession_logout";

const Transition = function Transition(
  props: TransitionProps & {
    children: JSXElement;
  }
) {
  return <Slide direction="down" {...props} />;
};

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [openLogout, setOpenLogout] = createSignal(false);

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
    window.open("/user", "_blank");
  };

  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
    checkSubStatus();
  });

  onMount(() => {
    checkSubStatus();
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
        >
          <Settings fontSize="medium" />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl()}
        id="account-menu"
        open={open()}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
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
              bgcolor: "background.paper",
              zIndex: 0,
            },
            "& .MuiMenuItem-root": {
              minHeight: "24px",
            },
          },
        }}
        // transformOrigin={{
        //   horizontal: "right",
        //   vertical: "top",
        // }}
        // anchorOrigin={{
        //   horizontal: "right",
        //   vertical: "bottom",
        // }}
      >
        <MenuItem onClick={handleDashboardNavigate}>
          <ListItemIcon>
            <PersonPinOutlined />
          </ListItemIcon>
          <Typography variant="body1"> Dashboard</Typography>
        </MenuItem>
        <MenuItem onClick={handleModalOpen}>
          <ListItemIcon>
            <NotesRounded />
          </ListItemIcon>
          <Typography variant="body1">Rules</Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PlayCircleOutlineOutlined />
          </ListItemIcon>
          <Typography variant="body1">Rules (video)</Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PolicyOutlined />
          </ListItemIcon>
          <Typography variant="body1"> Terms of Use</Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SecurityRounded />
          </ListItemIcon>
          <Typography variant="body1"> Privacy Policy</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClickOpenLogout}>
          <ListItemIcon>
            <LogoutOutlined fontSize="small" />
          </ListItemIcon>
          <Typography variant="body1">Logout</Typography>
        </MenuItem>
      </Menu>
      <Dialog
        open={openLogout()}
        TransitionComponent={Transition}
        onClose={handleCloseLogout}
        aria-describedby="alert-dialog-slide-description"
      >
        <Show when={isAuthenticated() && userSubstatus()}>
          <div class="bg-slate-50">
            <div class="flex flex-col justify-center items-center">
              <div>
                <DialogContent>
                  <DialogTitle class="flex justify-center items-center">
                    End Session and Logout
                  </DialogTitle>
                  <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you want to{" "}
                    <span class="text-error-500"> end</span> the session and
                    logout? All game data will be deleted.
                  </DialogContentText>
                </DialogContent>
              </div>
              <div>
                <EndSessionLogout />
              </div>
            </div>
            <DialogActions>
              <Button onClick={handleCloseLogout}>Cancel</Button>
            </DialogActions>
          </div>
        </Show>
      </Dialog>
      <Modal
        open={modalOpen()}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "scroll",
            display: "block",
            bgcolor: "background.paper",
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
              backgroundColor: "#3f3f46",
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
          >
            Game Rules
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Commonly Odd is trivia game that can be played by a single player or
            a group (up to 10 teams)
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Each team goes one by one in a round robin style.
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
          >
            Setting Up the Game
          </Typography>

          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Session Creation: </span>A designated
              individual, the session starter, sets up the game session. They
              select the number of participating teams (up to 10) and the total
              score goal (up to 30).
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Link Distribution: </span>A unique session
              link is generated for sharing with other players.
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
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
          >
            Scoring Points
          </Typography>

          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">2: </span>Awarded for correctly
              identifying the outlier and its exact reasoning.
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">1.5: </span>Given for correctly
              identifying the outlier and partially correct reasoning.
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">1: </span>For partial correctness, either
              in identifying the outlier or reasoning.
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
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
          >
            Winning the Game
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
            }}
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
          >
            Gameplay
          </Typography>

          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Session Starter's Role: </span>Controls
              game flow, including question selection, answer reveals, and
              scorekeeping.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Time Constraint: </span>Teams have a
              15-second window per round for decision-making.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Answer Revelation: </span>The session
              starter reveals the correct answers after each round.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
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
          >
            Terminology
          </Typography>

          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Session Starter: </span>The individual
              responsible for initiating and managing the game session.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Session Link: </span>A unique URL used by
              players to join the game session.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Outlier Object: </span>The object that
              differs from the other two in the presented trio.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Commonality: </span>The shared attribute
              or connection between two of the objects.
            </ListItem>
          </List>

          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Game Session: </span>The period from the
              start of the game until it ends or a new game begins.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Time Limit: </span>Each decision-making
              round is restricted to 15 seconds.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Sportsmanship: </span>Players are
              encouraged to maintain a friendly and respectful environment
              during gameplay.
            </ListItem>
          </List>
          <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
            <ListItem sx={{ display: "list-item" }}>
              <span class="font-bold">Game Commencement: </span>The start of the
              game, initiated by the session starter.
            </ListItem>
          </List>
        </Box>
      </Modal>
    </>
  );
}
