import { openings } from './openings';

export function getOpeningByKey(openingKey) {
  return openings.find(({ key }) => key === openingKey);
}
