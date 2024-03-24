import { Box, Button, List, ListItem, Modal, Typography } from "@suid/material";
import { Show, JSX } from "solid-js";

interface PointItem {
  bold: string;
  normal: string;
}

interface InfoItem {
  term?: string;
  definition?: string;
  points?: PointItem[];
  section?: string;
  description?: string;
}

interface InfoModalProps {
  title: string;
  content: InfoItem[];
  icon: JSX.Element;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

export default function InfoModal(props: InfoModalProps) {
  const handleClose = () => props.setOpenModal(!props.openModal);

  return (
    <div>
      <Button onClick={() => props.setOpenModal(true)}>{props.icon}</Button>

      <Modal open={props.openModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "scroll",
            display: "block",
            boxShadow: 24,
            marginTop: "5px",
            paddingRight: "5px",
            paddingTop: "5px",
            paddingLeft: "5px",
            border: "1px solid #f9a8d4",
            "&::-webkit-scrollbar": {
              width: 5,
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 1,
            },
          }}
          class="w-10/12 h-1/2 lg:w-1/2 lg:h-1/2"
        >
          <Typography variant="h6" component="h2" class="text-center">
            {props.title}
          </Typography>
          <div class="mt-4 ">
            {props.content.map((item: InfoItem) => (
              <div class="py-2">
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {item.term || item.section}
                </Typography>
                <Typography>{item.definition || item.description}</Typography>
                <Show when={item.points}>
                  <List sx={{ listStyleType: "disc", marginLeft: "20px" }}>
                    {item.points?.map((point: PointItem) => (
                      <ListItem sx={{ display: "list-item" }}>
                        <span class="font-bold">{point.bold}</span>{" "}
                        {point.normal}
                      </ListItem>
                    ))}
                  </List>
                </Show>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
