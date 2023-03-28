import ProcessHelper from "../../test/util/ProcessHelper";
import { FORMAT_HTML, FORMAT_PLAIN, FORMATS } from "../constants/formats";
import { LINE_ENDINGS } from "../constants/lineEndings";
import { SUPPORTED_PLATFORMS } from "../constants/platforms";
import PotaIpsum from "./PotaIpsum";

describe("PotaIpsum", () => {
  const process = new ProcessHelper();

  afterEach(() => process.resetPlatform());

  test("Should throw an error if instantiated with an unsupported format", () => {
    try {
      /* tslint:disable-next-line:no-unused-variable */
      // @ts-ignore
      const pota = new PotaIpsum({}, "blade");
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual(
        `blade is an invalid format. Please use ${FORMATS.join(" or ")}.`,
      );
    }
  });

  describe("getLineEnding", () => {
    test("Should return WIN32 line ending on WIN32", () => {
      const pota = new PotaIpsum();
      process.setPlatform(SUPPORTED_PLATFORMS.WIN32);
      expect(pota.getLineEnding()).toEqual(LINE_ENDINGS.WIN32);
    });

    test("Should return POSIX line ending on Mac or Linux", () => {
      const pota = new PotaIpsum();
      [SUPPORTED_PLATFORMS.DARWIN, SUPPORTED_PLATFORMS.LINUX].forEach((platform) => {
        process.setPlatform(platform);
        expect(pota.getLineEnding()).toEqual(LINE_ENDINGS.POSIX);
      });
    });

    test("Should return the 'suffix' if it was set", () => {
      const pota = new PotaIpsum({}, FORMAT_PLAIN, "*");
      expect(pota.getLineEnding()).toEqual("*");
    });
  });

  describe("formatString", () => {
    const str = "string";

    test("Should return the string by default", () => {
      const pota = new PotaIpsum();
      expect(pota.formatString(str)).toEqual(str);
    });

    test("Should return the string if the format is set to 'plain'", () => {
      const pota = new PotaIpsum({}, FORMAT_PLAIN);
      expect(pota.formatString(str)).toEqual(str);
    });

    test("Should return the string wrapped in p tags if the format is set to 'html'", () => {
      const pota = new PotaIpsum({}, FORMAT_HTML);
      expect(pota.formatString(str)).toEqual(`<p>${str}</p>`);
    });
  });

  describe("formatStrings", () => {
    const strings = ["string", "string-a", "string-b"];

    test("Should return the string by default", () => {
      const pota = new PotaIpsum();
      const results = pota.formatStrings(strings);
      results.forEach((result, index) => {
        expect(result).toEqual(strings[index]);
      });
    });

    test("Should return the string if the format is set to 'plain'", () => {
      const pota = new PotaIpsum({}, FORMAT_PLAIN);
      const results = pota.formatStrings(strings);
      results.forEach((result, index) => {
        expect(result).toEqual(strings[index]);
      });
    });

    test("Should return the string wrapped in p tags if the foramt is set to 'html'", () => {
      const pota = new PotaIpsum({}, FORMAT_HTML);
      const results = pota.formatStrings(strings);
      results.forEach((result, index) => {
        expect(result).toEqual(`<p>${strings[index]}</p>`);
      });
    });
  });

  describe("generateWords", () => {
    it("should generate a specific number of words", () => {
      const pota = new PotaIpsum();
      const results = pota.generateWords(7);
      const words = results.split(" ");
      expect(words).toHaveLength(7);
    });

    it("should generate a number of words between the min and max", () => {
      const max = 5;
      const min = 3;
      const pota = new PotaIpsum({
        wordsPerSentence: { max, min },
      });
      for (let i = 0; i < 100; i++) {
        const results = pota.generateWords();
        const words = results.split(" ");
        expect(words.length <= max).toEqual(true);
        expect(words.length >= min).toEqual(true);
      }
    });
  });

  describe("generateSentences", () => {
    it("should generate a specific number of sentences", () => {
      const pota = new PotaIpsum();
      const results = pota.generateSentences(18);
      const sentences = results.split(". ");
      expect(sentences).toHaveLength(18);
    });

    it("should generate a number of sentences between the min and max", () => {
      const max = 19;
      const min = 16;
      const pota = new PotaIpsum({
        sentencesPerParagraph: { max, min },
      });
      for (let i = 0; i < 100; i++) {
        const results = pota.generateSentences();
        const sentences = results.split(". ");
        expect(sentences.length <= max).toEqual(true);
        expect(sentences.length >= min).toEqual(true);
      }
    });
  });

  describe("generateParagraphs", () => {
    it("should generate a specific number of paragraphs", () => {
      process.setPlatform(SUPPORTED_PLATFORMS.WIN32);
      const pota = new PotaIpsum();
      const results = pota.generateParagraphs(3);
      const paragraphs = results.split(LINE_ENDINGS.WIN32);
      expect(paragraphs).toHaveLength(3);
    });
  });
});
