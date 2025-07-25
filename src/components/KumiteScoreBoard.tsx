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

  const CompetitorPanel: React.FC<{
    competitor: 'aka' | 'ao';
    state: CompetitorState;
    label: string;
  }> = ({ competitor, state, label }) => (
    <Card className={`flex-1 p-6 ${competitor === 'aka' ? 'bg-gradient-aka' : 'bg-gradient-ao'} border-2`}>
      <div className="text-center">
        <div className="text-white text-3xl font-bold mb-2">{label}</div>
        <div className="text-white text-6xl font-bold mb-6">Score: {state.score}</div>
        
        {/* Scoring buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Button
            variant="score"
            size="sm"
            onClick={() => addScore(competitor, 'yuko')}
          >
            Yuko (+1)
          </Button>
          <Button
            variant="score"
            size="sm"
            onClick={() => addScore(competitor, 'wazari')}
          >
            Wazari (+2)
          </Button>
          <Button
            variant="score"
            size="sm"
            onClick={() => addScore(competitor, 'ippon')}
          >
            Ippon (+3)
          </Button>
          <Button
            variant="cancel"
            size="sm"
            onClick={() => cancelLast(competitor)}
          >
            Cancel (-1)
          </Button>
        </div>

        {/* Penalty buttons */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <Button
            variant="penalty"
            size="sm"
            onClick={() => addPenalty(competitor, 'c1')}
            className={state.c1 > 0 ? 'bg-yellow-500 text-black' : ''}
          >
            C1
          </Button>
          <Button
            variant="penalty"
            size="sm"
            onClick={() => addPenalty(competitor, 'c2')}
            className={state.c2 > 0 ? 'bg-yellow-500 text-black' : ''}
          >
            C2
          </Button>
          <Button
            variant="penalty"
            size="sm"
            onClick={() => addPenalty(competitor, 'c3')}
            className={state.c3 > 0 ? 'bg-yellow-500 text-black' : ''}
          >
            C3
          </Button>
          <Button
            variant="penalty"
            size="sm"
            onClick={() => addPenalty(competitor, 'hc')}
            className={state.hc > 0 ? 'bg-orange-500 text-white' : ''}
          >
            HC
          </Button>
          <Button
            variant="penalty"
            size="sm"
            onClick={() => addPenalty(competitor, 'h')}
            className={state.h > 0 ? 'bg-red-500 text-white' : ''}
          >
            H
          </Button>
        </div>

        {/* SENSHU indicator */}
        <Button
          variant={state.senshu ? "senshu" : "penalty"}
          size="lg"
          onClick={() => toggleSenshu(competitor)}
          className="w-full"
        >
          SENSHU
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-main p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Advanced Taekwondo Martial Arts
          </h1>
          
          {/* Timer */}
          <div className="bg-timer rounded-xl p-6 mb-6 border border-border/30">
            <div className="text-6xl font-mono font-bold text-white mb-4">
              {formatTime(timer.minutes, timer.seconds)}
            </div>
          </div>
        </div>

        {/* Main scoring area */}
        <div className="flex gap-6 mb-6">
          <CompetitorPanel competitor="aka" state={akaState} label="AKA" />
          <CompetitorPanel competitor="ao" state={aoState} label="AO" />
        </div>

        {/* Control buttons */}
        <div className="flex justify-center gap-4 mb-4">
          {showSettings ? (
            <Card className="p-4 bg-control border border-border/30">
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
              <Button variant="control" size="lg" onClick={() => setShowSettings(true)}>
                <Settings className="w-5 h-5 mr-2" />
                Set Match Time
              </Button>
              <Button variant="control" size="lg" onClick={resetTimer}>
                <RotateCcw className="w-5 h-5 mr-2" />
                Set Time
              </Button>
              <Button
                variant="control"
                size="lg"
                onClick={timer.isRunning ? stopTimer : startTimer}
              >
                {timer.isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button variant="control" size="lg" onClick={resetTimer}>
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Reset board button */}
        <div className="text-center">
          <Button variant="destructive" size="lg" onClick={resetBoard}>
            Reset Board
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KumiteScoreBoard;