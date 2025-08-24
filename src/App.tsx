import React, { useState } from 'react';

interface Flip {
  id: number;
  result: 'heads' | 'tails';
  timestamp: string;
}

interface Stats {
  wins: number;
  losses: number;
  total: number;
}

type FlipMode = 'until-lose' | 'set-amount' | 'until-win' | null;

const CoinFlipApp: React.FC = () => {
  const [flips, setFlips] = useState<Flip[]>([]);
  const [flipCount, setFlipCount] = useState<number>(1);
  const [currentMode, setCurrentMode] = useState<FlipMode>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  const flipCoin = (): 'heads' | 'tails' => Math.random() < 0.5 ? 'heads' : 'tails';

  const addFlip = (result: 'heads' | 'tails'): 'heads' | 'tails' => {
    const newFlip: Flip = {
      id: Date.now(),
      result,
      timestamp: new Date().toLocaleTimeString()
    };
    setFlips(prev => [newFlip, ...prev]);
    return result;
  };

  const delay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

  const startUntilLose = async (): Promise<void> => {
    setCurrentMode('until-lose');
    setIsFlipping(true);
    setFlips([]);

    let consecutive = 0;
    while (true) {
      await delay(800);
      const result = flipCoin();
      addFlip(result);

      if (result === 'heads') {
        consecutive++;
      } else {
        break;
      }
    }
    setIsFlipping(false);
    setCurrentMode(null);
  };

  const startSetAmount = async (): Promise<void> => {
    setCurrentMode('set-amount');
    setIsFlipping(true);
    setFlips([]);

    for (let i = 0; i < flipCount; i++) {
      await delay(600 / (1 + flipCount * 0.2));
      const result = flipCoin();
      addFlip(result);
    }
    setIsFlipping(false);
    setCurrentMode(null);
  };

  const startUntilWin = async (): Promise<void> => {
    setCurrentMode('until-win');
    setIsFlipping(true);
    setFlips([]);

    while (true) {
      await delay(800);
      const result = flipCoin();
      addFlip(result);

      if (result === 'heads') {
        // Won on heads
        break;
      }
    }
    setIsFlipping(false);
    setCurrentMode(null);
  };

  const adjustFlipCount = (delta: number): void => {
    setFlipCount(prev => Math.max(1, prev + delta));
  };

  const getStats = (): Stats => {
    const wins = flips.filter(f => f.result === 'heads').length;
    const losses = flips.filter(f => f.result === 'tails').length;
    return { wins, losses, total: flips.length };
  };

  const stats = getStats();

  const getButtonText = (mode: FlipMode): string => {
    switch (mode) {
      case 'until-lose':
        return currentMode === 'until-lose' ? 'Lanzando hasta perder...' : 'Hasta Que Pierda';
      case 'set-amount':
        return currentMode === 'set-amount' ? `Lanzando hasta ${flipCount} tiradas...` : (flipCount === 1 ? `Lanzar Moneda` : `Lanzar ${flipCount} Monedas`);
      case 'until-win':
        return currentMode === 'until-win' ? 'Lanzando hasta ganar...' : 'Hasta Que Gane';
      default:
        return '';
    }
  };

  const getFlipEmoji = (result: 'heads' | 'tails'): string => {
    return result === 'heads' ? '✅' : '❌';
  };

  const getFlipStyling = (result: 'heads' | 'tails'): string => {
    return result === 'heads'
      ? 'bg-green-500/20 border-green-500'
      : 'bg-red-500/20 border-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-violet-900 to-red-700 text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Coinflipper</h1>
        </div>

        {/* Three Buttons */}
        <div className="space-y-4 mb-8">
          {/* Until I Lose Button */}
          <button
            onClick={startUntilLose}
            disabled={isFlipping}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 rounded-xl py-4 px-6 font-semibold text-lg shadow-lg transform hover:scale-105 disabled:transform-none"
          >
            {getButtonText('until-lose')}
          </button>

          {/* Set Amount Button with Controls */}
          <div className="bg-green-600 hover:bg-green-700 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-lg">Número de monedas</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => adjustFlipCount(-1)}
                  disabled={isFlipping || flipCount <= 1}
                  className="w-8 h-8 bg-green-800 hover:bg-green-900 disabled:bg-gray-600 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                  type="button"
                  aria-label="Decrease flip count"
                >
                  −
                </button>
                <span className="text-xl font-bold min-w-[3rem] text-center">{flipCount}</span>
                <button
                  onClick={() => adjustFlipCount(1)}
                  disabled={isFlipping}
                  className="w-8 h-8 bg-green-800 hover:bg-green-900 disabled:bg-gray-600 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                  type="button"
                  aria-label="Increase flip count"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={startSetAmount}
              disabled={isFlipping}
              className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 rounded-lg py-2 px-4 font-semibold shadow-md"
            >
              {getButtonText('set-amount')}
            </button>
          </div>

          {/* Until I Win Button */}
          <button
            onClick={startUntilWin}
            disabled={isFlipping}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 rounded-xl py-4 px-6 font-semibold text-lg shadow-lg transform hover:scale-105 disabled:transform-none"
          >
            {getButtonText('until-win')}
          </button>
        </div>

        {/* Stats */}
        {flips.length > 0 && (
          <div className="bg-black/20 backdrop-|blur-sm rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-center">{flips.length > 1 ? 'Resultados' : 'Resultado'}</h3>
            <div className={`grid gap-4 text-center ${flips.length > 1 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <div>
                <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
                <div className="text-sm text-gray-300">{flips.length <= 1 ? 'Ganada' : 'Ganadas'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{stats.losses}</div>
                <div className="text-sm text-gray-300">{flips.length <= 1 ? 'Perdida' : 'Perdidas'}</div>
              </div>
              {
                (flips.length > 1 && (
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                    <div className="text-sm text-gray-300">Total</div>
                  </div>
                ))
              }
              
            </div>
          </div>
        )}

        {/* Flip Results List */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">Historial de Tiradas</h3>

          {flips.length === 0 && !isFlipping && (
            <div className="text-center py-8 text-gray-400">
              <p>No he lanzado nada...</p>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
            {flips.map((flip, index) => (
              <div
                key={flip.id}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${getFlipStyling(flip.result)}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: index < 3 ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                }}>
                <span className="text-2xl mb-1">
                  {getFlipEmoji(flip.result)}
                </span>
                <div className="text-xs text-gray-400">
                  #{flips.length - index}
                </div>
              </div>
            ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinFlipApp;