export type MarketType = 'crypto' | 'weather';
export type TimerType = '15m' | '24h';
export type Prediction = 'yes' | 'no';

export interface Market {
  id: string;
  title: string;
  type: MarketType;
  timerType?: TimerType;
  liquidityFAsset: number;
  endTime: string;
  yesOdds: number;
  noOdds: number;
  resolutionSource: string;
}
