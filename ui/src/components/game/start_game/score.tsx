import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@suid/material";
import { Show, createSignal } from "solid-js";
import * as ST from "@suid/types";
import { teamName, teamID } from ".";
import ConfirmScoreDialog from "./confirm_score";
import CommonDialog from "../common_dialog";

const dialogTextStyle = {
  color: "#f9fafb",
};

const [open, setOpen] = createSignal(false);
const [value, setValue] = createSignal<number | undefined>(undefined);
const [scoreNotNumber, setScoreNotNumber] = createSignal(false);
const [confirmOpen, setConfirmOpen] = createSignal(false);
export const [scoreSubmittedDialogOpen, setScoreSubmittedDialogOpen] =
  createSignal(false);

const handleClose = () => {
  setOpen(false);
};

const handleChange = (event: ST.ChangeEvent<HTMLInputElement>) => {
  setValue(Number(event.target.value));
};

const handleSubmitScore = () => {
  if (value() === undefined) {
    setScoreNotNumber(true);
  } else {
    setConfirmOpen(true);
    setOpen(false);
  }
};

const handleScoreSubmitted = () => {
  setScoreSubmittedDialogOpen(true);
  setValue(undefined);
};

const closeScoreSubmittedDialog = () => {
  setScoreSubmittedDialogOpen(false);
};

const closeScoreNotNumberDialog = () => {
  setScoreNotNumber(false);
};

export const openScoreDialog = () => {
  setOpen(true);
};

export default function Score() {
  return (
    <div>
      <Dialog
        open={open()}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={dialogTextStyle}
          class="flex justify-center items-center"
        >
          Enter {teamName()}'s Score
        </DialogTitle>
        <DialogContent style={dialogTextStyle}>
          <DialogContentText
            id="alert-dialog-description"
            style={dialogTextStyle}
          >
            <FormControl style={dialogTextStyle}>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value()}
                onChange={handleChange}
                style={dialogTextStyle}
                sx={{
                  "& .MuiRadio-root": {
                    color: "#f9fafb",
                    "&:hover": {
                      bgcolor: "transparent",
                    },
                  },
                  "& .MuiRadio-colorPrimary.Mui-checked": {
                    color: "#f9fafb",
                  },
                }}
              >
                <div class="flex flex-row   justify-center px-6 py-4">
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="0"
                    style={dialogTextStyle}
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="1"
                    style={dialogTextStyle}
                  />
                  <FormControlLabel
                    value="1.5"
                    control={<Radio />}
                    label="1.5"
                    style={dialogTextStyle}
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="2"
                    style={dialogTextStyle}
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={dialogTextStyle}>
          <Button
            variant="outlined"
            onClick={handleSubmitScore}
            style="color: #f9fafb; border: none;"
          >
            Submit score
          </Button>
        </DialogActions>
      </Dialog>
      <Show when={confirmOpen()}>
        <ConfirmScoreDialog
          open={confirmOpen()}
          onClose={() => setConfirmOpen(false)}
          onScoreSubmitted={handleScoreSubmitted}
          teamId={teamID()}
          teamName={teamName()}
          score={value()}
        />
      </Show>
      <Show when={scoreNotNumber()}>
        <CommonDialog
          open={scoreNotNumber()}
          title="Select a Score"
          content="Please pick a score before submitting."
          onClose={closeScoreNotNumberDialog}
          showCancelButton={false}
        />
      </Show>

      <Show when={scoreSubmittedDialogOpen()}>
        <CommonDialog
          open={scoreSubmittedDialogOpen()}
          title="Score Status"
          content="Thanks for submitting the score."
          onClose={closeScoreSubmittedDialog}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
