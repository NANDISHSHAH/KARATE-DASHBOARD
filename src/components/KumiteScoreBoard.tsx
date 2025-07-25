import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompetitorState {
  score: number;
  yuko: number;
  wazari: number;
  ippon: number;
  c1: number;
  c2: number;
  c3: number;
  hc: number;
  h: number;
  senshu: boolean;
}

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  matchDuration: number;
}

const KumiteScoreBoard: React.FC = () => {
  const [akaState, setAkaState] = useState<CompetitorState>({
    score: 0,
    yuko: 0,
    wazari: 0,
    ippon: 0,
    c1: 0,
    c2: 0,
    c3: 0,
    hc: 0,
    h: 0,
    senshu: false
  });

  const [aoState, setAoState] = useState<CompetitorState>({
    score: 0,
    yuko: 0,
    wazari: 0,
    ippon: 0,
    c1: 0,
    c2: 0,
    c3: 0,
    hc: 0,
    h: 0,
    senshu: false
  });

  const [timer, setTimer] = useState<TimerState>({
    minutes: 1,
    seconds: 30,
    isRunning: false,
    matchDuration: 90
  });

  const [showSettings, setShowSettings] = useState(false);
  const [matchTimeInput, setMatchTimeInput] = useState("1.5");

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isRunning && (timer.minutes > 0 || timer.seconds > 0)) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            return { ...prev, isRunning: false };
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.minutes, timer.seconds]);

  // Scoring functions
  const updateCompetitor = useCallback((competitor: 'aka' | 'ao', updates: Partial<CompetitorState>) => {
    const setState = competitor === 'aka' ? setAkaState : setAoState;
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const addScore = useCallback((competitor: 'aka' | 'ao', type: 'yuko' | 'wazari' | 'ippon') => {
    const points = { yuko: 1, wazari: 2, ippon: 3 }[type];
    const setState = competitor === 'aka' ? setAkaState : setAoState;
    setState(prev => ({
      ...prev,
      score: prev.score + points,
      [type]: prev[type] + 1
    }));
  }, []);

  const addPenalty = useCallback((competitor: 'aka' | 'ao', type: 'c1' | 'c2' | 'c3' | 'hc' | 'h') => {
    const setState = competitor === 'aka' ? setAkaState : setAoState;
    setState(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  }, []);

  const cancelLast = useCallback((competitor: 'aka' | 'ao') => {
    const setState = competitor === 'aka' ? setAkaState : setAoState;
    setState(prev => ({
      ...prev,
      score: Math.max(0, prev.score - 1)
    }));
  }, []);

  const toggleSenshu = useCallback((competitor: 'aka' | 'ao') => {
    const setState = competitor === 'aka' ? setAkaState : setAoState;
    setState(prev => ({
      ...prev,
      senshu: !prev.senshu
    }));
  }, []);

  // Timer controls
  const startTimer = () => setTimer(prev => ({ ...prev, isRunning: true }));
  const stopTimer = () => setTimer(prev => ({ ...prev, isRunning: false }));
  const resetTimer = () => {
    const minutes = Math.floor(timer.matchDuration / 60);
    const seconds = timer.matchDuration % 60;
    setTimer(prev => ({ ...prev, minutes, seconds, isRunning: false }));
  };

  const setMatchTime = () => {
    const duration = Math.round(parseFloat(matchTimeInput) * 60);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    setTimer({ minutes, seconds, isRunning: false, matchDuration: duration });
    setShowSettings(false);
  };

  const resetBoard = () => {
    setAkaState({
      score: 0, yuko: 0, wazari: 0, ippon: 0, c1: 0, c2: 0, c3: 0, hc: 0, h: 0, senshu: false
    });
    setAoState({
      score: 0, yuko: 0, wazari: 0, ippon: 0, c1: 0, c2: 0, c3: 0, hc: 0, h: 0, senshu: false
    });
    resetTimer();
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* AKA Side - Full Red */}
        <div className="flex-1 bg-gradient-aka flex flex-col">
          {/* Header and Timer - AKA Side */}
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold text-white mb-4">
              Advanced Taekwondo Martial Arts
            </h1>
            <div className="bg-black/20 rounded-xl p-4 mb-4 border border-white/20">
              <div className="text-4xl font-mono font-bold text-white">
                {formatTime(timer.minutes, timer.seconds)}
              </div>
            </div>
          </div>

          {/* AKA Competitor Panel */}
          <div className="flex-1 p-6">
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-4">AKA</div>
              <div className="text-white text-8xl font-bold mb-8">Score: {akaState.score}</div>
              
              {/* Scoring buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  variant="score"
                  size="xl"
                  onClick={() => addScore('aka', 'yuko')}
                >
                  Yuko (+1)
                </Button>
                <Button
                  variant="score"
                  size="xl"
                  onClick={() => addScore('aka', 'wazari')}
                >
                  Wazari (+2)
                </Button>
                <Button
                  variant="score"
                  size="xl"
                  onClick={() => addScore('aka', 'ippon')}
                >
                  Ippon (+3)
                </Button>
                <Button
                  variant="cancel"
                  size="xl"
                  onClick={() => cancelLast('aka')}
                >
                  Cancel (-1)
                </Button>
              </div>

              {/* Penalty buttons */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('aka', 'c1')}
                  className={akaState.c1 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C1
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('aka', 'c2')}
                  className={akaState.c2 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C2
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('aka', 'c3')}
                  className={akaState.c3 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C3
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('aka', 'hc')}
                  className={akaState.hc > 0 ? 'bg-orange-500 text-white' : ''}
                >
                  HC
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('aka', 'h')}
                  className={akaState.h > 0 ? 'bg-red-500 text-white' : ''}
                >
                  H
                </Button>
              </div>

              {/* SENSHU indicator */}
              <Button
                variant={akaState.senshu ? "senshu" : "penalty"}
                size="xl"
                onClick={() => toggleSenshu('aka')}
                className="w-full"
              >
                SENSHU
              </Button>
            </div>
          </div>
        </div>

        {/* AO Side - Full Blue */}
        <div className="flex-1 bg-gradient-ao flex flex-col">
          {/* Control buttons - AO Side */}
          <div className="p-6">
            <div className="flex justify-center gap-3 mb-4">
              {showSettings ? (
                <Card className="p-4 bg-black/20 border border-white/20">
                  <div className="flex items-center gap-4">
                    <Label className="text-white">Match Time (minutes):</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={matchTimeInput}
                      onChange={(e) => setMatchTimeInput(e.target.value)}
                      className="w-20"
                    />
                    <Button variant="control" onClick={setMatchTime}>
                      Set Time
                    </Button>
                    <Button variant="control" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                  </div>
                </Card>
              ) : (
                <>
                  <Button variant="control" onClick={() => setShowSettings(true)}>
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="control" onClick={resetTimer}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="control"
                    onClick={timer.isRunning ? stopTimer : startTimer}
                  >
                    {timer.isRunning ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="destructive" onClick={resetBoard}>
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* AO Competitor Panel */}
          <div className="flex-1 p-6">
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-4">AO</div>
              <div className="text-white text-8xl font-bold mb-8">Score: {aoState.score}</div>
              
              {/* Scoring buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  variant="score"
                  size="xl"
                  onClick={() => addScore('ao', 'yuko')}
                >
                  Yuko (+1)
                </Button>
                <Button
                  variant="score"
                  size="xl"
                  onClick={() => addScore('ao', 'wazari')}
                >
                  Wazari (+2)
                </Button>
                <Button
                  variant="score"
                  size="xl"
                  onClick={() => addScore('ao', 'ippon')}
                >
                  Ippon (+3)
                </Button>
                <Button
                  variant="cancel"
                  size="xl"
                  onClick={() => cancelLast('ao')}
                >
                  Cancel (-1)
                </Button>
              </div>

              {/* Penalty buttons */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('ao', 'c1')}
                  className={aoState.c1 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C1
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('ao', 'c2')}
                  className={aoState.c2 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C2
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('ao', 'c3')}
                  className={aoState.c3 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C3
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('ao', 'hc')}
                  className={aoState.hc > 0 ? 'bg-orange-500 text-white' : ''}
                >
                  HC
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => addPenalty('ao', 'h')}
                  className={aoState.h > 0 ? 'bg-red-500 text-white' : ''}
                >
                  H
                </Button>
              </div>

              {/* SENSHU indicator */}
              <Button
                variant={aoState.senshu ? "senshu" : "penalty"}
                size="xl"
                onClick={() => toggleSenshu('ao')}
                className="w-full"
              >
                SENSHU
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KumiteScoreBoard;