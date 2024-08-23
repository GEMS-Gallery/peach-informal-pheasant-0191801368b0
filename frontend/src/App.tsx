import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, CircularProgress, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { backend } from 'declarations/backend';

interface Player {
  lifeTotal: number;
  commanderDamage: number[];
  poisonCounters: number;
}

const initialPlayer: Player = {
  lifeTotal: 40,
  commanderDamage: [0, 0, 0, 0],
  poisonCounters: 0,
};

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(Array(4).fill(initialPlayer));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameState();
  }, []);

  const fetchGameState = async () => {
    try {
      const gameState = await backend.getGameState();
      const parsedState = parseGameState(gameState);
      setPlayers(parsedState);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching game state:', error);
      setLoading(false);
    }
  };

  const parseGameState = (gameState: string): Player[] => {
    const lines = gameState.trim().split('\n');
    return lines.map(line => {
      const [, lifeStr, poisonStr, cmdDamageStr] = line.split(': ');
      const life = parseInt(lifeStr.split('=')[1]);
      const poison = parseInt(poisonStr.split('=')[1]);
      const cmdDamage = JSON.parse(cmdDamageStr.split('=')[1]);
      return { lifeTotal: life, poisonCounters: poison, commanderDamage: cmdDamage };
    });
  };

  const updateLifeTotal = async (playerId: number, change: number) => {
    setLoading(true);
    await backend.updateLifeTotal(playerId, BigInt(change));
    await fetchGameState();
  };

  const updateCommanderDamage = async (playerId: number, opponentId: number, change: number) => {
    setLoading(true);
    await backend.updateCommanderDamage(playerId, opponentId, BigInt(change));
    await fetchGameState();
  };

  const updatePoisonCounters = async (playerId: number, change: number) => {
    setLoading(true);
    await backend.updatePoisonCounters(playerId, BigInt(change));
    await fetchGameState();
  };

  const resetGame = async () => {
    setLoading(true);
    await backend.resetGame();
    await fetchGameState();
  };

  const PlayerArea: React.FC<{ player: Player; playerId: number }> = ({ player, playerId }) => (
    <Box className="player-area">
      <Typography variant="h6">Player {playerId + 1}</Typography>
      <Typography className="life-total">{player.lifeTotal}</Typography>
      <Box>
        <Button className="counter-button" onClick={() => updateLifeTotal(playerId, -1)}>
          <RemoveIcon />
        </Button>
        <Button className="counter-button" onClick={() => updateLifeTotal(playerId, 1)}>
          <AddIcon />
        </Button>
      </Box>
      <Typography>Poison: {player.poisonCounters}</Typography>
      <Box>
        <Button className="counter-button" onClick={() => updatePoisonCounters(playerId, -1)}>
          <RemoveIcon />
        </Button>
        <Button className="counter-button" onClick={() => updatePoisonCounters(playerId, 1)}>
          <AddIcon />
        </Button>
      </Box>
      <Typography>Commander Damage:</Typography>
      {player.commanderDamage.map((damage, index) => (
        index !== playerId && (
          <Box key={index}>
            <Typography>From P{index + 1}: {damage}</Typography>
            <Button className="counter-button" onClick={() => updateCommanderDamage(playerId, index, -1)}>
              <RemoveIcon />
            </Button>
            <Button className="counter-button" onClick={() => updateCommanderDamage(playerId, index, 1)}>
              <AddIcon />
            </Button>
          </Box>
        )
      ))}
    </Box>
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}>
      <Grid container spacing={2}>
        {players.map((player, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <PlayerArea player={player} playerId={index} />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="secondary" onClick={resetGame} className="reset-button">
        Reset Game
      </Button>
    </Box>
  );
};

export default App;