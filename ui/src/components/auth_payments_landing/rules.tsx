import { Router } from "solid-app-router";
import AccountMenu from "../settings/index.jsx";
import { Component } from "solid-js";
import Header from "./header";
import Footer from "./footer";
import HeaderMobile from "./header_mobile.jsx";

const Rules: Component = () => {
  return (
    <>
      <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200  ">
        <div class="flex flex-col max-w-7xl  mx-auto min-h-screen">
          <div class="hidden md:block">
            <Header />
          </div>
          <div class="block md:hidden">
            <HeaderMobile />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Rules;

{
  /* <Modal
  open={modalOpen()}
  onClose={handleModalClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
  style={dialogTextStyle}
>
  <Box
    sx={{
      position: "absolute",
      backgroundImage: "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
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
      Commonly Odd is trivia game that can be played by a single player or a
      group (up to 10 teams)
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
      Players are presented with three items per round. The team must correctly
      determine which of three items is the outlier and the commonality shared
      by the other two. Each round is time-limited to 15 seconds.
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
        individual, the session starter, sets up the game session. They select
        the number of participating teams (up to 10) and the total score goal
        (up to 30).
      </ListItem>
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Link Distribution: </span>A unique session link
        is generated for sharing with other players.
      </ListItem>
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Game Commencement: </span>The session starter
        initiates the game once all players are on the same game session link.
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
        <span class="font-bold">2: </span>Awarded for correctly identifying the
        outlier and its exact reasoning.
      </ListItem>
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">1.5: </span>Given for correctly identifying the
        outlier and partially correct reasoning.
      </ListItem>
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">1: </span>For partial correctness, either in
        identifying the outlier or reasoning.
      </ListItem>
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">0: </span>For incorrect guesses or no response.
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
      The game is won by the first team to meet or exceed the target score.
      Post-game, the session starter can launch a new game or end the session.{" "}
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
        <span class="font-bold">Session Starter's Role: </span>Controls game
        flow, including question selection, answer reveals, and scorekeeping.
      </ListItem>
    </List>
    <List
      sx={{ listStyleType: "disc", marginLeft: "20px" }}
      style={dialogTextStyle}
    >
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Time Constraint: </span>Teams have a 15-second
        window per round for decision-making.
      </ListItem>
    </List>
    <List
      sx={{ listStyleType: "disc", marginLeft: "20px" }}
      style={dialogTextStyle}
    >
      <ListItem sx={{ display: "list-item" }}>
        <span class="font-bold">Answer Revelation: </span>The session starter
        reveals the correct answers after each round.
      </ListItem>
    </List>
    <List
      sx={{ listStyleType: "disc", marginLeft: "20px" }}
      style={dialogTextStyle}
    >
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Scoring System: </span>Points are awarded based
        on accuracy.
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
        <span class="font-bold">Outlier Object: </span>The object that differs
        from the other two in the presented trio.
      </ListItem>
    </List>
    <List
      sx={{ listStyleType: "disc", marginLeft: "20px" }}
      style={dialogTextStyle}
    >
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Commonality: </span>The shared attribute or
        connection between two of the objects.
      </ListItem>
    </List>

    <List
      sx={{ listStyleType: "disc", marginLeft: "20px" }}
      style={dialogTextStyle}
    >
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Game Session: </span>The period from the start
        of the game until it ends or a new game begins.
      </ListItem>
    </List>
    <List
      sx={{ listStyleType: "disc", marginLeft: "20px" }}
      style={dialogTextStyle}
    >
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Time Limit: </span>Each decision-making round is
        restricted to 15 seconds.
      </ListItem>
    </List>
    <List
      sx={{ listStyleType: "disc", marginLeft: "20px" }}
      style={dialogTextStyle}
    >
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Sportsmanship: </span>Players are encouraged to
        maintain a friendly and respectful environment during gameplay.
      </ListItem>
    </List>
    <List
      sx={{ listStyleType: "disc", marginLeft: "20px" }}
      style={dialogTextStyle}
    >
      <ListItem sx={{ display: "list-item" }} style={dialogTextStyle}>
        <span class="font-bold">Game Commencement: </span>The start of the game,
        initiated by the session starter.
      </ListItem>
    </List>
  </Box>
</Modal>; */
}
