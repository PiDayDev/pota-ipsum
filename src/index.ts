import { PotaFormat, FORMAT_PLAIN } from "./constants/formats";
import {
  PotaUnit,
  UNIT_PARAGRAPH,
  UNIT_PARAGRAPHS,
  UNIT_SENTENCES,
  UNIT_SENTENCE,
  UNIT_WORDS,
  UNIT_WORD,
} from "./constants/units";
import { WORDS } from "./constants/words";
import { IPrng } from "./lib/generator";
import PotaIpsum from "./lib/PotaIpsum";

export interface IPotaIpsumParams {
  count?: number;
  format?: PotaFormat;
  paragraphLowerBound?: number;
  paragraphUpperBound?: number;
  random?: IPrng;
  sentenceLowerBound?: number;
  sentenceUpperBound?: number;
  units?: PotaUnit;
  words?: string[];
  suffix?: string;
}

const potaIpsum = ({
  count = 1,
  format = FORMAT_PLAIN,
  paragraphLowerBound = 3,
  paragraphUpperBound = 7,
  random,
  sentenceLowerBound = 5,
  sentenceUpperBound = 15,
  units = UNIT_SENTENCES,
  words = WORDS,
  suffix = "",
}: IPotaIpsumParams = {}): string => {
  const options = {
    random,
    sentencesPerParagraph: {
      max: paragraphUpperBound,
      min: paragraphLowerBound,
    },
    words,
    wordsPerSentence: {
      max: sentenceUpperBound,
      min: sentenceLowerBound,
    },
  };

  const pota: PotaIpsum = new PotaIpsum(options, format, suffix);

  switch (units) {
    case UNIT_PARAGRAPHS:
    case UNIT_PARAGRAPH:
      return pota.generateParagraphs(count);
    case UNIT_SENTENCES:
    case UNIT_SENTENCE:
      return pota.generateSentences(count);
    case UNIT_WORDS:
    case UNIT_WORD:
      return pota.generateWords(count);
    default:
      return "";
  }
};

export { potaIpsum, PotaIpsum };
