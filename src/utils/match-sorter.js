// https://github.com/kentcdodds/match-sorter

export default function matchSorter(items, value, options = {}) {
  const rankings = {
    CASE_SENSITIVE_EQUAL: 7,
    EQUAL: 6,
    STARTS_WITH: 5,
    WORD_STARTS_WITH: 4,
    CONTAINS: 3,
    ACRONYM: 2,
    MATCHES: 1,
    NO_MATCH: 0,
  };

  const defaultBaseSortFn = (a, b) =>
    String(a.rankedValue).localeCompare(String(b.rankedValue));

  const {
    keys,
    threshold = rankings.MATCHES,
    baseSort = defaultBaseSortFn,
    sorter = (matchedItems) =>
      matchedItems.sort((a, b) => sortRankedValues(a, b, baseSort)),
  } = options;

  const matchedItems = items.reduce((matches, item, index) => {
    const rankingInfo = getHighestRanking(item, keys, value, options, rankings);
    const { rank, keyThreshold = threshold } = rankingInfo;

    if (rank >= keyThreshold) {
      matches.push({ ...rankingInfo, item, index });
    }
    return matches;
  }, []);

  return sorter(matchedItems).map(({ item }) => item);
}

function sortRankedValues(a, b, baseSort) {
  if (a.rank === b.rank) {
    return baseSort(a, b);
  }
  return a.rank > b.rank ? -1 : 1;
}

function getHighestRanking(item, keys, value, options, rankings) {
  if (!keys) {
    const stringItem = String(item);
    return {
      rankedValue: stringItem,
      rank: getMatchRanking(stringItem, value, options, rankings),
      keyIndex: -1,
      keyThreshold: options.threshold,
    };
  }

  const valuesToRank = keys.map((key) =>
    typeof key === "function" ? key(item) : item[key]
  );

  return valuesToRank.reduce(
    (bestRank, itemValue, index) => {
      const rank = getMatchRanking(itemValue, value, options, rankings);
      if (rank > bestRank.rank) {
        return { rank, rankedValue: itemValue, keyIndex: index };
      }
      return bestRank;
    },
    { rank: rankings.NO_MATCH, rankedValue: "", keyIndex: -1 }
  );
}

function getMatchRanking(testString, stringToRank, options, rankings) {
  testString = prepareValueForComparison(testString, options);
  stringToRank = prepareValueForComparison(stringToRank, options);

  if (stringToRank.length > testString.length) {
    return rankings.NO_MATCH;
  }

  if (testString === stringToRank) {
    return rankings.CASE_SENSITIVE_EQUAL;
  }

  testString = testString.toLowerCase();
  stringToRank = stringToRank.toLowerCase();

  if (testString === stringToRank) {
    return rankings.EQUAL;
  }

  if (testString.startsWith(stringToRank)) {
    return rankings.STARTS_WITH;
  }

  if (testString.includes(stringToRank)) {
    return rankings.CONTAINS;
  }

  return rankings.NO_MATCH;
}

function prepareValueForComparison(value) {
  return String(value).toLowerCase();
}
