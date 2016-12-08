#!/bin/bash
SESSION=$USER

tmux -2 new-session -d -s $SESSION

tmux set -t $SESSION mouse on
tmux set -t $SESSION mouse-select-pane on
tmux set -t $SESSION mouse-resize-pane on

tmux split-window -v
tmux select-pane -t 0
tmux send-keys "yarn start:dev" C-m
tmux select-pane -t 1
tmux send-keys "yarn build:dev" C-m

tmux -2 attach-session -t $SESSION
