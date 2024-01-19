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

const [open, setOpen] = createSignal(false);
const [value, setValue] = createSignal<number>(0);
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
  setConfirmOpen(true);
  setOpen(false); // Close the score dialog
};

const handleScoreSubmitted = () => {
  setScoreSubmittedDialogOpen(true);
};

const closeScoreSubmittedDialog = () => {
  setScoreSubmittedDialogOpen(false);
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
      >
        <DialogTitle id="alert-dialog-title">
          Enter {teamName()}'s Score
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value()}
                onChange={handleChange}
              >
                <div class="flex flex-row justify-center px-6 py-4">
                  <FormControlLabel value="0" control={<Radio />} label="0" />
                  <FormControlLabel value="1" control={<Radio />} label="1" />
                  <FormControlLabel
                    value="1.5"
                    control={<Radio />}
                    label="1.5"
                  />
                  <FormControlLabel value="2" control={<Radio />} label="2" />
                </div>
              </RadioGroup>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleSubmitScore}>
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
