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

  // Toggle penalty function
  const togglePenalty = useCallback((competitor: 'aka' | 'ao', type: 'c1' | 'c2' | 'c3' | 'hc' | 'h') => {
    const setState = competitor === 'aka' ? setAkaState : setAoState;
    setState(prev => ({
      ...prev,
      [type]: prev[type] > 0 ? 0 : 1
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

  // Determine lead
  const akaLead = akaState.score - aoState.score >= 6;
  const aoLead = aoState.score - akaState.score >= 6;

  return (
    <div className="min-h-screen bg-background">
      {/* Centered Timer */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Advanced Taefudo Martial Arts
          </h1>
          <div className="bg-black/30 rounded-xl p-4 border border-white/20">
            <div className="text-6xl font-mono font-bold text-white">
              {formatTime(timer.minutes, timer.seconds)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Centered Control Buttons */}
        <div className="absolute left-1/2 top-40 transform -translate-x-1/2 z-20">
          <div className="flex justify-center gap-3">
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

        {/* AKA Side - Full Red */}
        <div className="flex-1 bg-gradient-aka flex flex-col pt-32">
          {/* AKA Competitor Panel */}
          <div className="flex-1 p-6">
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-4">AKA</div>
              <div className="text-white text-8xl font-bold mb-8 flex items-center justify-center">
                <span className={akaLead ? "animate-flicker" : ""}>Score: {akaState.score}</span>
                {akaLead && <span className="ml-4 text-yellow-300 text-6xl">🏆</span>}
              </div>
              
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
                  className="text-white"
                >
                  Cancel (-1)
                </Button>
              </div>

              {/* Penalty buttons */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('aka', 'c1')}
                  className={akaState.c1 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C1
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('aka', 'c2')}
                  className={akaState.c2 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C2
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('aka', 'c3')}
                  className={akaState.c3 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C3
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('aka', 'hc')}
                  className={akaState.hc > 0 ? 'bg-orange-500 text-white' : ''}
                >
                  HC
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('aka', 'h')}
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
        <div className="flex-1 bg-gradient-ao flex flex-col pt-32">
          {/* AO Competitor Panel */}
          <div className="flex-1 p-6">
            <div className="text-center">
              <div className="text-white text-4xl font-bold mb-4">AO</div>
              <div className="text-white text-8xl font-bold mb-8 flex items-center justify-center">
                <span className={aoLead ? "animate-flicker" : ""}>Score: {aoState.score}</span>
                {aoLead && <span className="ml-4 text-yellow-300 text-6xl">🏆</span>}
              </div>
              
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
                  className="text-white"
                >
                  Cancel (-1)
                </Button>
              </div>

              {/* Penalty buttons */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('ao', 'c1')}
                  className={aoState.c1 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C1
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('ao', 'c2')}
                  className={aoState.c2 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C2
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('ao', 'c3')}
                  className={aoState.c3 > 0 ? 'bg-yellow-500 text-black' : ''}
                >
                  C3
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('ao', 'hc')}
                  className={aoState.hc > 0 ? 'bg-orange-500 text-white' : ''}
                >
                  HC
                </Button>
                <Button
                  variant="penalty"
                  size="lg"
                  onClick={() => togglePenalty('ao', 'h')}
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
      {/* Add flicker animation CSS */}
      <style>
        {`
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .animate-flicker {
            animation: flicker 0.7s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default KumiteScoreBoard;