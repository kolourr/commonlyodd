import websocket
import json



# for messages start, end
# try:
#     ws = websocket.create_connection("ws://localhost:8080/ws?sessionUUID=9834400c-27a1-44a4-b242-883a758713b8&starterToken=9da5c17d-b130-4905-8787-61797bcb101d")
#     start_message = json.dumps({"game_state": "start"})
#     ws.send(start_message)
#     response = ws.recv()
#     print("Received:", response)
#     ws.close()
# except Exception as e:
#     print("Exception:", e)


# for messages reveal
# try:
#     ws = websocket.create_connection("ws://localhost:8080/ws?sessionUUID=9834400c-27a1-44a4-b242-883a758713b8&starterToken=9da5c17d-b130-4905-8787-61797bcb101d")
#     start_message = json.dumps({"game_state": "reveal"})
#     ws.send(start_message)
#     response = ws.recv()
#     print("Received:", response)
#     ws.close()
# except Exception as e:
#     print("Exception:", e)



# continue
# try:
#     ws = websocket.create_connection("ws://localhost:8080/ws?sessionUUID=9834400c-27a1-44a4-b242-883a758713b8&starterToken=9da5c17d-b130-4905-8787-61797bcb101d")
#     team_id=294
#     team_name = "Team 1"
#     start_message = json.dumps({"game_state": "continue", "team_id": team_id, "team_name": team_name})
#     ws.send(start_message)
#     response = ws.recv()
#     print("Received:", response)
#     ws.close()
# except Exception as e:
#     print("Exception:", e)

#score
# try:
#     ws = websocket.create_connection("ws://localhost:8080/ws?sessionUUID=9834400c-27a1-44a4-b242-883a758713b8&starterToken=9da5c17d-b130-4905-8787-61797bcb101d")

#     # Replace these values with appropriate ones for your test
#     team_id = 294  # Example team ID
#     team_name = "Team 2"  # Example team name
#     score = 1.5  # Example score (can be 0, 1, 1.5, or 2)

#     # Construct the score message
#     score_message = {
#         "game_state": "score",
#         "team_id": team_id,
#         "individual_team_score":  score
#     }

#     # Send the score message
#     ws.send(json.dumps(score_message))

#     # Wait for a response
#     response = ws.recv()
#     print("Received:", response)

#     ws.close()
# except Exception as e:
#     print("Exception:", e)



















