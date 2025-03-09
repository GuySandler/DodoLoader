var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { M as MapUtils, F as FStorage, S as StorageKeyEnum, W as WEBSITE_URL, L as LATEST_MAP_CODE_VERSION, a as FINDER_MAX_RESULTS, U as ULTRAHARD_UNLOCK_AT_OVERALL_PERCENT, C as CupIdEnum, A as ALL_CUP_IDS, b as ALL_DIFFICULTIES, c as ALL_SKIN_IDS, d as SkinIdEnum, e as CupUtils, P as PageIdEnum, N as NewcomerUtils, f as UrlUtils, g as API_SERVER_URL, h as MiscUtils, i as CLOSE_BUTTON_TEXT, j as LinkEnum, k as StorageValueEnum, l as NEWCOMER_GRADUATE_AT_MAP_COMPLETION_COUNT, D as DeploymentUtils, m as ColorEnum, n as SoundFileEnum, R as RouteEnum, o as ALL_SOUND_FILE_PATHS, p as SettingsUtils, q as ArrayUtils, r as FGlobalManager, s as defineComponent, _ as _export_sfc, t as createElementBlock, u as createBaseVNode, v as createCommentVNode, w as createStaticVNode, x as openBlock, y as pushScopeId, z as popScopeId, B as MapPropertyUtils, E as toDisplayString, G as normalizeClass, H as Fragment, I as renderList, J as createVNode, K as resolveComponent, O as normalizeStyle, Q as RecentMapUtils, T as withDirectives, V as vModelText, X as withKeys, Y as QueryKeyEnum } from "./index.js";
import {dodoCup} from "../dodoCup.js";
class CompletedMapUtils {
  static async getCompletionDictionary() {
    const mapCompletionDictionary = {};
    const allMapIds = MapUtils.getAllMapIds();
    const completedMaps = await CompletedMapUtils.getTotalCompletedMaps();
    for (const mapId of allMapIds) {
      const completedMap = completedMaps.find((completedMap2) => completedMap2.mapId === mapId);
      mapCompletionDictionary[mapId] = {
        count: completedMap == null ? 0 : completedMap.count,
        time: completedMap == null ? Infinity : completedMap.time
      };
    }
    return mapCompletionDictionary;
  }
  static async onMapCompleted(mapId, time, countToAdd = 1) {
    const completedMaps = await CompletedMapUtils.getLocalCompletedMaps();
    const completedMap = completedMaps.find((completedMap2) => completedMap2.mapId === mapId);
    if (completedMap == null) {
      const newCompletedLevel = {
        mapId,
        time,
        count: countToAdd
      };
      completedMaps.push(newCompletedLevel);
    } else {
      completedMap.time = Math.min(completedMap.time, time);
      completedMap.count += countToAdd;
    }
    await CompletedMapUtils.overwriteLocalCompletedMapsWithArray(completedMaps);
  }
  static async overwriteLocalCompletedMapsWithArray(completedMaps) {
    const completedMapsText = JSON.stringify(completedMaps);
    await FStorage.set(StorageKeyEnum.LocalCompletedMaps, completedMapsText);
  }
  static async getLocalCompletedMaps() {
    return await CompletedMapUtils.readCompletedMapsStorageKey(StorageKeyEnum.LocalCompletedMaps);
  }
  static async getRemoteCompletedMaps() {
    return await CompletedMapUtils.readCompletedMapsStorageKey(StorageKeyEnum.RemoteCompletedMaps);
  }
  static async getCloudCompletedMaps() {
    return await CompletedMapUtils.readCompletedMapsStorageKey(StorageKeyEnum.CloudCompletedMaps);
  }
  static openMapListingInWebsite(mapListing) {
    if (mapListing == null)
      throw new Error("mapListing is null");
    window.open(WEBSITE_URL + "/?mapId=" + mapListing.mapId, "_blank");
  }
  static openBrewListingInWebsite(brewListing) {
    const link = `${WEBSITE_URL}/singleplayer?mapCodeVersion=${LATEST_MAP_CODE_VERSION}&mapUrl=${encodeURIComponent(brewListing.jsUrl)}`;
    window.open(link, "_blank");
  }
  static getUnbeatenMapListings(mapCompletionDictionary) {
    const unbeatenMapListings = [];
    for (const key in mapCompletionDictionary) {
      if (mapCompletionDictionary[key].count > 0)
        continue;
      const mapListing = MapUtils.getMapListingFromMapId(key);
      if (mapListing == null)
        continue;
      if (MapUtils.doesContain(unbeatenMapListings, mapListing))
        continue;
      unbeatenMapListings.push(mapListing);
      if (unbeatenMapListings.length >= FINDER_MAX_RESULTS)
        break;
    }
    return unbeatenMapListings;
  }
  static async getTotalCompletedMaps() {
    const localCompletedMaps = await CompletedMapUtils.getLocalCompletedMaps();
    const remoteCompletedMaps = await CompletedMapUtils.getRemoteCompletedMaps();
    const cloudCompletedMaps = await CompletedMapUtils.getCloudCompletedMaps();
    return MapUtils.getCompletedMapsMergedUnique([
      ...localCompletedMaps,
      ...remoteCompletedMaps,
      ...cloudCompletedMaps
    ]);
  }
  static async getDeviceCompletedMaps() {
    const localCompletedMaps = await CompletedMapUtils.getLocalCompletedMaps();
    const remoteCompletedMaps = await CompletedMapUtils.getRemoteCompletedMaps();
    return MapUtils.getCompletedMapsMergedUnique([
      ...localCompletedMaps,
      ...remoteCompletedMaps
    ]);
  }
  static async readCompletedMapsStorageKey(storageKey) {
    const completedMapsText = await FStorage.getString(storageKey);
    if (completedMapsText == null)
      return [];
    const completedMaps = JSON.parse(completedMapsText);
    return completedMaps;
  }
}
class PercentUtils {
  static getTextWithSymbol(percent) {
    return Math.floor(percent * 100) + "%";
  }
}
class ProgressUtils {
  static getPercentTextFromProgress(progress) {
    if (progress.totalMaps == 0)
      return "NA";
    const percent = progress.completedMaps / progress.totalMaps;
    return PercentUtils.getTextWithSymbol(percent);
  }
  static getMainProgressState(mapCompletionDictionary) {
    const cupProgressDictionary = ProgressUtils.getCupProgressDictionaryFromMapCompletionDictionary(mapCompletionDictionary);
    return {
      cupProgressDictionary,
      diffProgressDictionary: ProgressUtils.getDiffProgressDictionaryFromMapCompletionDictionary(mapCompletionDictionary),
      overallProgress: ProgressUtils.getOverallProgressFromCupProgressDictionary(cupProgressDictionary)
    };
  }
  static isUltrahardUnlocked(overallProgress) {
    const percent = overallProgress.completedMaps / overallProgress.totalMaps;
    return percent >= ULTRAHARD_UNLOCK_AT_OVERALL_PERCENT;
  }
  static isUltraHardAndLocked(cupId, mainProgressState) {
    if (cupId !== CupIdEnum.Ultrahard)
      return false;
    return !ProgressUtils.isUltrahardUnlocked(mainProgressState.overallProgress);
  }
  static getCupProgressDictionaryFromMapCompletionDictionary(mapCompletionDictionary) {
    const newProgressDictionary = {};
    for (const cupId of ALL_CUP_IDS) {
      let totalMapsInCup = 0;
      let completedMapsInCup = 0;
      let totalPointsInCup = 0;
      const mapListings = MapUtils.getMapListings(cupId);
      for (const mapListing of mapListings) {
        totalMapsInCup += 1;
        if (mapCompletionDictionary[mapListing.mapId].count > 0)
          completedMapsInCup += 1;
        totalPointsInCup += mapCompletionDictionary[mapListing.mapId].count * mapListing.diff;
      }
      newProgressDictionary[cupId] = {
        totalPoints: totalPointsInCup,
        totalMaps: totalMapsInCup,
        completedMaps: completedMapsInCup
      };
    }
    return newProgressDictionary;
  }
  static getOverallProgressFromCupProgressDictionary(cupProgressDictionary) {
    let completedMaps = 0;
    let totalMaps = 0;
    let totalPoints = 0;
    for (const cupId of ALL_CUP_IDS) {
      if (cupId == CupIdEnum.Vault)
        continue;
      if (cupId == CupIdEnum.Newcomer)
        continue;
      if (cupId == CupIdEnum.Brew)
        continue;
      totalPoints += cupProgressDictionary[cupId].totalPoints;
      completedMaps += cupProgressDictionary[cupId].completedMaps;
      totalMaps += cupProgressDictionary[cupId].totalMaps;
    }
    return { totalPoints, totalMaps, completedMaps };
  }
  static getDiffProgressDictionaryFromMapCompletionDictionary(mapCompletionDictionary) {
    const diffProgressDictionary = [];
    for (const diff of ALL_DIFFICULTIES)
      [
        diffProgressDictionary[diff] = {
          totalPoints: 0,
          totalMaps: 0,
          completedMaps: 0
        }
      ];
    for (const cupId of ALL_CUP_IDS) {
      if (cupId == CupIdEnum.Vault)
        continue;
      if (cupId == CupIdEnum.Newcomer)
        continue;
      if (cupId == CupIdEnum.Brew)
        continue;
      for (const mapListing of MapUtils.getMapListings(cupId)) {
        if (!ALL_DIFFICULTIES.includes(mapListing.diff))
          continue;
        const mapCompletion = mapCompletionDictionary[mapListing.mapId];
        diffProgressDictionary[mapListing.diff].totalPoints += mapCompletion.count * mapListing.diff;
        diffProgressDictionary[mapListing.diff].totalMaps += 1;
        diffProgressDictionary[mapListing.diff].completedMaps += mapCompletion.count > 0 ? 1 : 0;
      }
    }
    return diffProgressDictionary;
  }
}
class SkinUtils {
  static getSkinIdsSorted(skinStateDictionary) {
    return ALL_SKIN_IDS.sort((a2, b2) => {
      return skinStateDictionary[b2].percent - skinStateDictionary[a2].percent;
    });
  }
  static async getSkinStateDictionary(mainProgressState) {
    const skinStateDictionary = {};
    for (const skinId of ALL_SKIN_IDS) {
      skinStateDictionary[skinId] = await SkinUtils.getSkinState(skinId, mainProgressState);
    }
    return skinStateDictionary;
  }
  static async unlockPuzzleSkin(skinId) {
    const skinIds = await SkinUtils.getUnlockedSkinIds();
    if (skinIds.includes(skinId))
      return;
    skinIds.push(skinId);
    await FStorage.set(StorageKeyEnum.UnlockedPuzzleSkinIds, skinIds.join(","));
  }
  static getSkinImageSrc(skinId) {
    if (skinId == null)
      return SkinUtils.getSkinImageSrc(SkinIdEnum.Default);
    const skinName = SkinIdEnum[skinId].toLowerCase();
    if (skinId > 57) {
        return JSON.parse(localStorage.getItem("CupImages"))[skinId-58]
    }
    else {return `/assets/skins/${skinName}.png`;}
  }
  static getPercent(progress) {
    return progress.completedMaps / progress.totalMaps;
  }
  static async getPuzzlePercent(skinId) {
    const skinIds = await SkinUtils.getUnlockedSkinIds();
    return skinIds.includes(skinId) ? 1 : 0;
  }
  static async getUnlockedSkinIds() {
    const storageValue = await FStorage.getString(StorageKeyEnum.UnlockedPuzzleSkinIds);
    if (storageValue == null)
      return [];
    return storageValue.split(",").map((s2) => parseInt(s2.trim(), 10));
  }
  static clampPercentBetween0and1(percent) {
    if (percent <= 0)
      return 0;
    if (percent >= 1)
      return 1;
    return percent;
  }
  static async getSkinState(skinId, mainProgressState) {
    const skinState = await SkinUtils.getRawSkinState(skinId, mainProgressState);
    skinState.percent = SkinUtils.clampPercentBetween0and1(skinState.percent);
    return skinState;
  }
  static isPuzzleSkin(skinId) {
    switch (skinId) {
      case SkinIdEnum.PuzzleA:
        return true;
      default:
        return false;
    }
  }
  static async getRawSkinState(skinId, mainProgressState) {
    if (skinId > 57) {
        return {
            name: "Default",
            percent: 1,
            howToGet: "Open your eyes"
          };
    }
    else {
    switch (skinId) {
      case SkinIdEnum.Default:
        return {
          name: "Default",
          percent: 1,
          howToGet: "Open your eyes"
        };
      case SkinIdEnum.Newcomer:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Newcomer),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Newcomer]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Newcomer)} maps`
        };
      case SkinIdEnum.Pilot:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Pilot),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Pilot]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Pilot)} maps`
        };
      case SkinIdEnum.Carrot:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Carrot),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Carrot]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Carrot)} maps`
        };
      case SkinIdEnum.Rocky:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Rocky),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Rocky]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Rocky)} maps`
        };
      case SkinIdEnum.Dodo:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Dodo),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Dodo]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Dodo)} maps`
        };
      case SkinIdEnum.Skilled:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Skilled),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Skilled]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Skilled)} maps`
        };
      case SkinIdEnum.Furby:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Furby),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Furby]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Furby)} maps`
        };
      case SkinIdEnum.Doom:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Doom),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Doom]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Doom)} maps`
        };
      case SkinIdEnum.Kazil:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Kazil),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Kazil]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Kazil)} maps`
        };
      case SkinIdEnum.Zhou:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Zhou),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Zhou]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Zhou)} maps`
        };
      case SkinIdEnum.Moosh:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Moosh),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Moosh]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Moosh)} maps`
        };
      case SkinIdEnum.Awehero:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Awehero),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Awehero]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Awehero)} maps`
        };
      case SkinIdEnum.Ye:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Ye),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Ye]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Ye)} maps`
        };
      case SkinIdEnum.Tim:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Tim),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Tim]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Tim)} maps`
        };
      case SkinIdEnum.Ghoul:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Ghoul),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Ghoul]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Ghoul)} maps`
        };
      case SkinIdEnum.Abc:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Abc),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Abc]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Abc)} maps`
        };
      case SkinIdEnum.Rytai:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Rytai),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Rytai]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Rytai)} maps`
        };
      case SkinIdEnum.Jay:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Jay),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Jay]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Jay)} maps`
        };
      case SkinIdEnum.Golden:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Golden),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Golden]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Golden)} maps`
        };
      case SkinIdEnum.Bean:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Bean),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Bean]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Bean)} maps`
        };
      case SkinIdEnum.Fish:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Fish),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Fish]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Fish)} maps`
        };
      case SkinIdEnum.Dark:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Dark),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Dark]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Dark)} maps`
        };
      case SkinIdEnum.PainBumpo:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.PainBumpo),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.PainBumpo]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.PainBumpo)} maps`
        };
      case SkinIdEnum.Thero:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Thero),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Thero]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Thero)} maps`
        };
      case SkinIdEnum.Crazy:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Crazy),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Crazy]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Crazy)} maps`
        };
      case SkinIdEnum.June:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.June),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.June]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.June)} maps`
        };
      case SkinIdEnum.Sleepy:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Sleepy),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Sleepy]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Sleepy)} maps`
        };
      case SkinIdEnum.Mango:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Mango),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Mango]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Mango)} maps`
        };
      case SkinIdEnum.Squirrel:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Squirrel),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Squirrel]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Squirrel)} maps`
        };
      case SkinIdEnum.Insolence:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Insolence),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Insolence]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Insolence)} maps`
        };
      case SkinIdEnum.Modded:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Modded),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Modded]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Modded)} maps`
        };
      case SkinIdEnum.Collab:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Collab),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Collab]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Collab)} maps`
        };
      case SkinIdEnum.Og:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Og),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Og]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Og)} maps`
        };
      case SkinIdEnum.Ultrahard:
        return {
          name: CupUtils.getShortCupName(CupIdEnum.Ultrahard),
          percent: SkinUtils.getPercent(mainProgressState.cupProgressDictionary[CupIdEnum.Ultrahard]),
          howToGet: `Finish all ${CupUtils.getCupName(CupIdEnum.Ultrahard)} maps`
        };
      case SkinIdEnum.Diff1:
        return {
          name: "Diff 1",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[1]),
          howToGet: "Finish all difficulty 1 maps"
        };
      case SkinIdEnum.Diff2:
        return {
          name: "Diff 2",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[2]),
          howToGet: "Finish all difficulty 2 maps"
        };
      case SkinIdEnum.Diff3:
        return {
          name: "Diff 3",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[3]),
          howToGet: "Finish all difficulty 3 maps"
        };
      case SkinIdEnum.Diff4:
        return {
          name: "Diff 4",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[4]),
          howToGet: "Finish all difficulty 4 maps"
        };
      case SkinIdEnum.Diff5:
        return {
          name: "Diff 5",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[5]),
          howToGet: "Finish all difficulty 5 maps"
        };
      case SkinIdEnum.Diff6:
        return {
          name: "Diff 6",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[6]),
          howToGet: "Finish all difficulty 6 maps"
        };
      case SkinIdEnum.Diff7:
        return {
          name: "Diff 7",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[7]),
          howToGet: "Finish all difficulty 7 maps"
        };
      case SkinIdEnum.Diff8:
        return {
          name: "Diff 8",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[8]),
          howToGet: "Finish all difficulty 8 maps"
        };
      case SkinIdEnum.Diff9:
        return {
          name: "Diff 9",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[9]),
          howToGet: "Finish all difficulty 9 maps"
        };
      case SkinIdEnum.Diff10:
        return {
          name: "Diff 10",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[10]),
          howToGet: "Finish all difficulty 1 maps"
        };
      case SkinIdEnum.Diff11:
        return {
          name: "Diff 11",
          percent: SkinUtils.getPercent(mainProgressState.diffProgressDictionary[11]),
          howToGet: "Finish all difficulty 1 maps"
        };
      case SkinIdEnum.PointsA:
        return {
          name: "20pt",
          percent: mainProgressState.overallProgress.totalPoints / 20,
          howToGet: "Get 20pt overall"
        };
      case SkinIdEnum.PointsB:
        return {
          name: "100pt",
          percent: mainProgressState.overallProgress.totalPoints / 100,
          howToGet: "Get 100pt overall"
        };
      case SkinIdEnum.PointsC:
        return {
          name: "200pt",
          percent: mainProgressState.overallProgress.totalPoints / 200,
          howToGet: "Get 200pt overall"
        };
      case SkinIdEnum.PointsD:
        return {
          name: "500pt",
          percent: mainProgressState.overallProgress.totalPoints / 500,
          howToGet: "Get 500pt overall"
        };
      case SkinIdEnum.PointsE:
        return {
          name: "1000pt",
          percent: mainProgressState.overallProgress.totalPoints / 1e3,
          howToGet: "Get 1000pt overall"
        };
      case SkinIdEnum.PointsF:
        return {
          name: "2000pt",
          percent: mainProgressState.overallProgress.totalPoints / 2e3,
          howToGet: "Get 2000pt overall"
        };
      case SkinIdEnum.PercentA:
        return {
          name: "20%",
          percent: SkinUtils.getPercent(mainProgressState.overallProgress) / 0.2,
          howToGet: "Beat 20% of all the maps"
        };
      case SkinIdEnum.PercentB:
        return {
          name: "40%",
          percent: SkinUtils.getPercent(mainProgressState.overallProgress) / 0.4,
          howToGet: "Beat 40% of all the maps"
        };
      case SkinIdEnum.PercentC:
        return {
          name: "60%",
          percent: SkinUtils.getPercent(mainProgressState.overallProgress) / 0.6,
          howToGet: "Beat 60% of all the maps"
        };
      case SkinIdEnum.PercentD:
        return {
          name: "80%",
          percent: SkinUtils.getPercent(mainProgressState.overallProgress) / 0.8,
          howToGet: "Beat 80% of all the maps"
        };
      case SkinIdEnum.PercentE:
        return {
          name: "100%",
          percent: SkinUtils.getPercent(mainProgressState.overallProgress),
          howToGet: "Beat 100% of all the maps"
        };
      case SkinIdEnum.PuzzleA:
        return {
          name: "Dog?",
          percent: await SkinUtils.getPuzzlePercent(skinId),
          howToGet: "Guess a secret word. See the creator's first instagram post for a hint."
        };
       
      case SkinIdEnum.Mod:
        return {
          name: "Mod",
          percent: await SkinUtils.getPuzzlePercent(skinId),
          howToGet: "Custom skin added by mods"
        };
    }}
  }
}
class MainStateUtils {
  static getInitialMainState() {
    return {
      isNewcomer: false,
      isUltrahardUnlocked: false,
      browsingCupId: CupIdEnum.Newcomer,
      mapListing: null,
      mapUrl: null,
      pageId: PageIdEnum.Menu,
      mapCompletionDictionary: {},
      mainProgressState: {},
      skinIdsSortedByOwned: [],
      skinStateDictionary: {}
    };
  }
  static async getNewMainState(oldMainState) {
    const mapCompletionDictionary = await CompletedMapUtils.getCompletionDictionary();
    const mainProgressState = ProgressUtils.getMainProgressState(mapCompletionDictionary);
    const isNewcomer = await NewcomerUtils.isNewcomer(mainProgressState);
    const isUltrahardUnlocked = ProgressUtils.isUltrahardUnlocked(mainProgressState.overallProgress);
    const skinStateDictionary = await SkinUtils.getSkinStateDictionary(mainProgressState);
    const skinIdsSortedByOwned = SkinUtils.getSkinIdsSorted(skinStateDictionary);
    return {
      isNewcomer,
      isUltrahardUnlocked,
      mapCompletionDictionary,
      mainProgressState,
      skinStateDictionary,
      skinIdsSortedByOwned,
      browsingCupId: oldMainState.browsingCupId,
      pageId: oldMainState.pageId,
      mapListing: oldMainState.mapListing,
      mapUrl: oldMainState.mapUrl
    };
  }
  static getMainStateChange(oldMainState, newMainState) {
    return {
      didGraduateNewcomer: oldMainState.isNewcomer && !newMainState.isNewcomer,
      didUnlockUltrahardCup: !oldMainState.isUltrahardUnlocked && newMainState.isUltrahardUnlocked,
      unlockedSkinId: MainStateUtils.getNewlyAddedSkin(oldMainState.skinStateDictionary, newMainState.skinStateDictionary)
    };
  }
  static getNewlyAddedSkin(oldSkinStateDictionary, newSkinStateDictionary) {
    for (const skinId of ALL_SKIN_IDS) {
      if (oldSkinStateDictionary[skinId] == null)
        continue;
      if (oldSkinStateDictionary[skinId].percent == 1)
        continue;
      if (newSkinStateDictionary[skinId].percent < 1)
        continue;
      return skinId;
    }
    return null;
  }
}
class FBaseWorld {
  constructor() {
  }
  async asyncInit() {
    await boot.preload();
    this.intervalManager.startInterval();
    const resolution = await FStorage.getString(StorageKeyEnum.ScreenResolution);
    this.resolutionManager.setResolution(resolution);
  }
  async applyPlayerSkin() {
    const skinId = await FStorage.getInteger(StorageKeyEnum.SelectedSkinId) ?? SkinIdEnum.Default;
    decorations.decorate_player(window.player, SkinUtils.getSkinImageSrc(skinId));
  }
  async onMapLoaded() {
    await boot.init();
    await this.applyPlayerSkin();
    this.resolutionManager.resizeScreenForGame();
    this.soundPlayer.onMapLoaded();
    this.endingManager.onMapLoaded();
    this.overlayManager.onMapLoaded();
  }
  onSettingsItemChanged(settingsItem, newStorageValue) {
    switch (settingsItem.storageKey) {
      case StorageKeyEnum.ScreenResolution:
        this.resolutionManager.setResolution(newStorageValue);
        break;
      case StorageKeyEnum.RenderLoop:
        this.intervalManager.onSettingsItemChanged(newStorageValue);
        break;
      case StorageKeyEnum.IsSoundOn:
        this.soundPlayer.onSettingsItemChanged(newStorageValue);
        break;
    }
  }
  onFrame() {
    this.overlayManager.onFrame();
    this.playerManager.onFrame();
  }
}
[PageIdEnum.Menu, PageIdEnum.Game];
class FBaseInputManager {
  constructor() {
    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    document.addEventListener("keyup", (event) => this.onKeyUp(event));
  }
}
class FSingleInputManager extends FBaseInputManager {
  constructor(world) {
    super();
    __publicField(this, "world");
    this.world = world;
  }
  onKeyDown(event) {
    switch (event.code) {
      case "KeyA":
        if (window.platformermode) {const positionAdjustment = window.tsTriggers.getPositionAdjustment()
            player.position.x -= positionAdjustment.z;
            player.position.z += positionAdjustment.x;break}
      case "ArrowLeft":
        if (!this.isOnMenuOrGame())
          break;
        if (this.world.isShowingPopup)
          break;
        event.preventDefault();
        window.controls.left = true;
        window.controls.right = false;
        if (this.canNavigateCupInMenu())
          this.world.changeCupByDeltaIndex(-1);
        break;
      case "KeyD":
        if (window.platformermode) {const positionAdjustment = window.tsTriggers.getPositionAdjustment()
            player.position.x += positionAdjustment.z;
            player.position.z -= positionAdjustment.x;break}
      case "ArrowRight":
        // if (window.platformermode) {window.Rightpress = true;break}
        if (!this.isOnMenuOrGame())
          break;
        if (this.world.isShowingPopup)
          break;
        event.preventDefault();
        window.controls.right = true;
        window.controls.left = false;
        if (this.canNavigateCupInMenu())
          this.world.changeCupByDeltaIndex(1);
        break;
      case "KeyW":
        // if (window.platformermode) {window.Wpress = true;break}
        if (window.platformermode) {const positionAdjustment = window.tsTriggers.getPositionAdjustment()
            player.position.x += positionAdjustment.x;
            player.position.z += positionAdjustment.z;break}
      case "ArrowUp":
      case "Space":
        if (window.platformermode) {flyjump.jump()}
        if (!this.isOnMenuOrGame())
          break;
        if (this.world.isShowingPopup)
          break;
        if (this.world.mainState.pageId !== PageIdEnum.Game)
          break;
        event.preventDefault();
        window.controls.space = true;
        this.world.endingManager.onSpacePressed();
        break;
      case "KeyS":
        // if (window.platformermode) {window.Spress = true;break}
        if (window.platformermode) {const positionAdjustment = window.tsTriggers.getPositionAdjustment()
            player.position.x -= positionAdjustment.x;
            player.position.z -= positionAdjustment.z;break}
      case "ArrowDown":
      case "ShiftLeft":
        if (!this.isOnMenuOrGame())
          break;
        if (this.world.isShowingPopup)
          break;
        if (this.world.mainState.pageId !== PageIdEnum.Game)
          break;
        event.preventDefault();
        window.controls.down = true;
        break;
      case "KeyR":
        if (!this.isOnMenuOrGame())
          break;
        if (this.world.isShowingPopup)
          break;
        if (!window.isMapLoaded)
          break;
        if (this.world.mainState.pageId !== PageIdEnum.Game)
          break;
        this.world.endingManager.onSelfDestructPressed();
        break;
      case "KeyX":
        this.onPressedKeyX();
        break;
    }
  }
  onKeyUp(event) {
    if (!this.isOnMenuOrGame())
      return;
    switch (event.code) {
      case "KeyA":
      case "ArrowLeft":
        window.controls.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        window.controls.right = false;
        break;
      case "KeyS":
      case "ArrowDown":
      case "ShiftLeft":
        if (this.world.mainState.pageId !== PageIdEnum.Game)
          return;
        event.preventDefault();
        window.controls.down = false;
        break;
      case "KeyW":
      case "ArrowUp":
      case "Space":
        window.controls.space = false;
        break;
    }
  }
  canNavigateCupInMenu() {
    if (this.world.mainState.pageId !== PageIdEnum.Menu)
      return false;
    if (this.world.mainState.isNewcomer)
      return false;
    return true;
  }
  onPressedKeyX() {
    if (this.world.isPopupShowing()) {
      this.world.closeCurrentPopup();
      return;
    }
    if (this.world.mainState.pageId !== PageIdEnum.Game)
      return;
    if (!window.isMapLoaded)
      return;
    if (window.alive)
      return;
    this.world.overlayManager.onMenuButtonClicked();
  }
  isOnMenuOrGame() {
    switch (this.world.mainState.pageId) {
      case PageIdEnum.Menu:
      case PageIdEnum.Game:
        return true;
      default:
        return false;
    }
  }
}
class FObjectManager {
  constructor(world) {
    __publicField(this, "world");
    this.world = world;
  }
  onCleanup() {
    cleanup.run();
  }
}
class FBaseEndingManager {
  constructor() {
    __publicField(this, "endingMapNameDiv", document.getElementById("endingMapName"));
    __publicField(this, "endingMakerNameDiv", document.getElementById("endingMakerName"));
  }
  onSelfDestructPressed() {
    if (!window.alive)
      return;
    change_state.die("Self Destructed");
  }
  writeMapAndMakerName(cupId) {
    this.endingMapNameDiv.innerText = map.title;
    this.endingMakerNameDiv.innerText = CupUtils.getCupName(cupId) + " X " + map.maker;
  }
}
class FetchUtils {
  static fetch(path, payload, returnNullInsteadOfCrash = false) {
    return new Promise((resolve2) => {
      const fetchUrl = API_SERVER_URL + path;
      const fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      };
      fetch(fetchUrl, fetchOptions).then(async function(res) {
        const jsonData = await res.json();
        if (res.status === 200) {
          resolve2(jsonData);
          return;
        }
        if (returnNullInsteadOfCrash) {
          resolve2(null);
        } else {
          UrlUtils.crash("Fetch request error: " + res.status + ". Specifically: " + jsonData.error);
        }
      }).catch(function(err) {
        if (returnNullInsteadOfCrash) {
          resolve2(null);
        } else {
          UrlUtils.crash("Fetch connect error: " + err.message);
        }
      });
    });
  }
}
var ApiEndpoints;
((ApiEndpoints2) => {
  ((GetNews2) => {
    GetNews2.Path = "/api/news";
  })(ApiEndpoints2.GetNews || (ApiEndpoints2.GetNews = {}));
  ((GetSticky2) => {
    GetSticky2.Path = "/api/sticky";
  })(ApiEndpoints2.GetSticky || (ApiEndpoints2.GetSticky = {}));
  ((GetMapInfo2) => {
    GetMapInfo2.Path = "/api/map_info";
  })(ApiEndpoints2.GetMapInfo || (ApiEndpoints2.GetMapInfo = {}));
  ((GetBrewListings2) => {
    GetBrewListings2.Path = "/api/brew_listings";
  })(ApiEndpoints2.GetBrewListings || (ApiEndpoints2.GetBrewListings = {}));
  ((CreateReview2) => {
    CreateReview2.Path = "/api/create_review";
  })(ApiEndpoints2.CreateReview || (ApiEndpoints2.CreateReview = {}));
  ((DeleteReview2) => {
    DeleteReview2.Path = "/api/delete_review";
  })(ApiEndpoints2.DeleteReview || (ApiEndpoints2.DeleteReview = {}));
  ((GetReviews2) => {
    GetReviews2.Path = "/api/get_reviews";
  })(ApiEndpoints2.GetReviews || (ApiEndpoints2.GetReviews = {}));
  ((SyncToCloud2) => {
    SyncToCloud2.Path = "/api/sync_to_cloud";
  })(ApiEndpoints2.SyncToCloud || (ApiEndpoints2.SyncToCloud = {}));
  ((GetMapLeaderboard2) => {
    GetMapLeaderboard2.Path = "/api/get_map_leaderboard";
  })(ApiEndpoints2.GetMapLeaderboard || (ApiEndpoints2.GetMapLeaderboard = {}));
  ((HideUserFromMapLeaderboard2) => {
    HideUserFromMapLeaderboard2.Path = "/api/hide_user_from_map_leaderboard";
  })(ApiEndpoints2.HideUserFromMapLeaderboard || (ApiEndpoints2.HideUserFromMapLeaderboard = {}));
  ((BanUserFromReview2) => {
    BanUserFromReview2.Path = "/api/ban_user_from_review";
  })(ApiEndpoints2.BanUserFromReview || (ApiEndpoints2.BanUserFromReview = {}));
  ((GetIsModerator2) => {
    GetIsModerator2.Path = "/api/get_is_moderator";
  })(ApiEndpoints2.GetIsModerator || (ApiEndpoints2.GetIsModerator = {}));
  ((BanUserFromLeaderboard2) => {
    BanUserFromLeaderboard2.Path = "/api/ban_user_from_leaderboard";
  })(ApiEndpoints2.BanUserFromLeaderboard || (ApiEndpoints2.BanUserFromLeaderboard = {}));
})(ApiEndpoints || (ApiEndpoints = {}));
class FSinglePopupManager {
  constructor(world) {
    __publicField(this, "world");
    this.world = world;
  }
  async displayPopups() {
    const pointsPopupResult = await this.displayPopupForPoints();
    if (pointsPopupResult.didShow)
      return;
    const newsPopupResult = await this.displayNewsPopup();
    if (newsPopupResult.didShow)
      return;
  }
  async displayNewsPopup() {
    if (this.world.mainState.mainProgressState.overallProgress.completedMaps === 0)
      return { didShow: false };
    const previousHash = await FStorage.getInteger(StorageKeyEnum.LastReadNewsSimpleHash);
    const fetchResult = await FetchUtils.fetch(ApiEndpoints.GetNews.Path, {}, true);
    if (fetchResult == null)
      return { didShow: false };
    if (this.world.mainState.pageId !== PageIdEnum.Menu)
      return { didShow: false };
    const newHash = MiscUtils.getSimpleHash(fetchResult.html);
    if (previousHash === newHash)
      return { didShow: false };
    this.world.createPopupItem({
      title: "News!",
      bodyAsHtml: fetchResult.html,
      buttons: [{
        text: CLOSE_BUTTON_TEXT,
        onClick: () => {
          void FStorage.set(StorageKeyEnum.LastReadNewsSimpleHash, newHash);
        }
      }]
    });
    return { didShow: true };
  }
  displayBrewCupActionBlockedPopup() {
    const popupItem = {
      title: "Not allowed",
      bodyAsHtml: "This feature is not available for test maps in Brew Cup.",
      buttons: []
    };
    this.world.createPopupItem(popupItem);
  }
  displayTestMapActionBlockedPopup() {
    const popupItem = {
      title: "Not allowed",
      bodyAsHtml: "This feature is not available for maps that are being tested.",
      buttons: []
    };
    this.world.createPopupItem(popupItem);
  }
  displayEngineFailedPopup() {
    const popupItem = {
      title: "WebGL Error",
      bodyAsHtml: `
                <p>WebGL is required for this game. Please enable WebGL. For Chrome:</p>
                <ul>
                    <li>Copy this into your URL bar: <span style="color: orange">chrome://settings/?search=hardware</span></li>
                    <li>Turn on "Use hardware acceleration when available"</li>
                    <li>Click the "Relaunch" button</li>
                </ul>
                <img src="/assets/other/engine_error.gif" style="width: 100%" />
            `,
      buttons: [{
        text: CLOSE_BUTTON_TEXT,
        onClick: () => {
          location.reload();
        }
      }]
    };
    this.world.createPopupItem(popupItem);
  }
  async displayPopupForPoints() {
    let nextPointPopupIndex = await FStorage.getInteger(StorageKeyEnum.NextPointPopupIndex);
    if (nextPointPopupIndex == null)
      nextPointPopupIndex = 0;
    const pointPopup = this.getPointPopup(nextPointPopupIndex);
    if (pointPopup == null)
      return { didShow: false };
    const updatedNextPointPopupIndex = nextPointPopupIndex + 1;
    const popupItem = {
      title: pointPopup.title,
      bodyAsHtml: pointPopup.bodyAsHtml,
      buttons: [{
        text: CLOSE_BUTTON_TEXT,
        onClick: () => {
          void FStorage.set(StorageKeyEnum.NextPointPopupIndex, updatedNextPointPopupIndex);
        }
      }]
    };
    this.world.createPopupItem(popupItem);
    return { didShow: true };
  }
  getPointPopup(nextPointPopupIndex) {
    const ALL_POINT_POPUPS = [
      {
        minPoints: 10,
        title: "Discord",
        bodyAsHtml: `Join our Discord server!<br><br><a href="${LinkEnum.Discord}" target="_blank">Discord Server</a>`
      },
      {
        minPoints: 20,
        title: "Other games",
        bodyAsHtml: `Onionfist Studio makes more games! Check out some of our other games.<br><br>
                    Play our other games: <a href="${LinkEnum.Homepage}" target="_blank">www.onionfist.com</a><br>
                    `
      },
      {
        minPoints: 45,
        title: "Follow me",
        bodyAsHtml: `Follow the game creator on instagram!<br><br><a href="${LinkEnum.Instagram}" target="_blank">@seojoon.y</a>`
      },
      {
        minPoints: 60,
        title: "Rate Us",
        bodyAsHtml: `Wow! You completed so many levels. If you are enjoying the game, please rate our free game to help us grow.<br><br>
                    Step 1: Go to <a href="${LinkEnum.IceDodoOnWebstore}" target="_blank">the web store</a><br>
                    Step 2: Click on "Reviews"
                    Step 3: Click on "Write a review"
                    `
      },
      {
        minPoints: 75,
        title: "Hmmm",
        bodyAsHtml: `Best instagram account on earth<br><br><a href="${LinkEnum.Instagram}" target="_blank">@seojoon.y</a>`
      },
      {
        minPoints: 90,
        title: "Make Maps",
        bodyAsHtml: `You can make your own Ice Dodo level. It is easier than you think!<br><br>
                    Make your first map: <a href="${LinkEnum.MapMakingTutorial}" target="_blank">Map making guide</a><br>
                    `
      }
    ];
    if (nextPointPopupIndex >= ALL_POINT_POPUPS.length)
      return null;
    const points = this.world.mainState.mainProgressState.overallProgress.totalPoints;
    const pointPopup = ALL_POINT_POPUPS[nextPointPopupIndex];
    if (points < pointPopup.minPoints)
      return null;
    return pointPopup;
  }
  static createMultiplayerPopupItem() {
    return {
      title: "Multiplayer",
      bodyAsHtml: "Race against your friends in real-time!",
      buttons: [{
        text: "Play online",
        onClick: () => {
          window.open(WEBSITE_URL + "/multiplayer", "_blank");
        }
      }]
    };
  }
  static createSyncPopupItem() {
    return {
      title: "Sync",
      bodyAsHtml: "Sync data across extension and website. You can also sync your data across devices using the cloud.",
      buttons: [{
        text: "Go to sync",
        onClick: () => {
          window.open(WEBSITE_URL + "/sync", "_blank");
        }
      }]
    };
  }
  static createWebsiteOnlyPopupItem(mapListing, cupOrMapText) {
    return {
      title: `Online ${cupOrMapText}`,
      bodyAsHtml: `This ${cupOrMapText} is only available online. Proceed to the website?`,
      buttons: [{
        text: "Cancel",
        onClick: () => {
        }
      }, {
        text: "Yep! I want to play",
        onClick: () => CompletedMapUtils.openMapListingInWebsite(mapListing)
      }]
    };
  }
  static createBrewOpenOnWebsitePopupItem(brewListing) {
    return {
      title: "Play on web",
      bodyAsHtml: `${brewListing.name} is only available online because it is an experimental map in Brew Cup. Proceed to the website?`,
      buttons: [{
        text: "Cancel",
        onClick: () => {
        }
      }, {
        text: "Yep! I want to play",
        onClick: () => CompletedMapUtils.openBrewListingInWebsite(brewListing)
      }]
    };
  }
  static createBrewPopupItem() {
    return {
      title: "Brewing maps",
      bodyAsHtml: "Maps brewing in the map development pool.<br><br>Test out a map before it is officially added to the game! You can play now but the level completions will not be saved.<br><br>Now choose a map to play!",
      buttons: []
    };
  }
  static createBrewMapCompleteNotSavedPopupItem() {
    return {
      title: "Not saved",
      bodyAsHtml: "You completed this map but the completion will not be saved because this is a test map in Brew Cup.",
      buttons: []
    };
  }
  static createUltraHardLockedPopupItem(mainProgressState, cupOrMapText) {
    return {
      title: "Ultrahard",
      bodyAsHtml: `
                For your own safety, this ultrahard ${cupOrMapText} is locked for now.
                <br><br>
                Complete ${PercentUtils.getTextWithSymbol(ULTRAHARD_UNLOCK_AT_OVERALL_PERCENT)} of all maps to unlock ultrahard maps. Your progress: ${ProgressUtils.getPercentTextFromProgress(mainProgressState.overallProgress)}
            `,
      buttons: [{
        text: CLOSE_BUTTON_TEXT,
        onClick: () => {
        }
      }]
    };
  }
  static createEpilepsyWarningPopup(openMap) {
    return {
      title: "Epilepsy",
      bodyAsHtml: `
                Please be warned that this map contains flashing lights and could be harmful to people with photosensitive epilepsy.
            `,
      buttons: [{
        text: "Play",
        onClick: openMap
      }, {
        text: "Cancel",
        onClick: () => {
        }
      }, {
        text: "I have no epilepsy",
        onClick: async () => {
          await FStorage.set(StorageKeyEnum.DoesUserHaveEpilepsy, StorageValueEnum.No);
          openMap();
        }
      }]
    };
  }
  static createInGameHelpPopupItem() {
    return {
      title: "How to Play",
      bodyAsHtml: `
                Use the arrow keys to move.<br>dfskhklfasdilfisdahfl
                Hit the green portal to win.<br>
                Do not fall off or hit the spikes.<br>
                <img style="width: 140px;" src="/assets/icons/controls.png" alt="controls">
                <br><br>
                In-game keyboard shortcuts:
                <ul>
                    <li>Left, right = Turning</li>
                    <li>Up = Jumping (when enabled)</li>
                    <li>Down = Drifting (when enabled)</li>
                    <li>R = Self destruct</li>
                </ul>
                Death / win screen keyboard shortcuts:
                <ul>
                    <li>X = Back to menu</li>
                    <li>Spacebar = respawn</li>
                </ul>
                `,
      buttons: []
    };
  }
  static createSpeedrunPopupItem(previousTime, newTime) {
    const timeDiff = newTime - previousTime;
    return {
      title: "Speedrun",
      bodyAsHtml: `
                You got a new speedrun time! (${timeDiff})<br>
                Previous time: ${previousTime}<br>
                New time: ${newTime}
            `,
      buttons: []
    };
  }
}
// popups
class PopupItemCreator {
  static newcomerGraduation() {
    return {
      title: "Congrats!",
      bodyAsHtml: `
                You completed ${NEWCOMER_GRADUATE_AT_MAP_COMPLETION_COUNT} maps in the game!
                <br><br>
                All maps and cups are unlocked. Go to the menu to check it out!`,
      buttons: []
    };
  }
  static ultrahardUnlocked() {
    return {
      title: "Congrats!",
      bodyAsHtml: `
                You unlocked the ultrahard cup!! This is a super rare achievement.`,
      buttons: []
    };
  }
  static skinUnlocked(skinId) {
    return {
      title: "New Skin!",
      bodyAsHtml: `
                You unlocked a new skin:
                <br>
                <img src="${SkinUtils.getSkinImageSrc(skinId)}" style="width: 100%; height: auto;"/>
                <br><br>
                Go to the skin tab to equip it!`,
      buttons: []
    };
  }
  static lowFpsDetected() {
    return {
      title: "Low FPS",
      bodyAsHtml: `
                Your FPS is too low. Tips to increase FPS:
                <ul>
                    <li>If using Chrome: Turn off Energy Saver</li>
                    <li>Close other tabs</li>
                    ${DeploymentUtils.isExtension() ? "" : "<li>Use 400P resolution, in game settings.</li>"}
                </ul>
                `,
      buttons: []
    };
  }
}
class FSingleEndingManager extends FBaseEndingManager {
  constructor(world) {
    super();
    __publicField(this, "world");
    __publicField(this, "endingDiv", document.getElementById("ending"));
    __publicField(this, "endingMainTextDiv", document.getElementById("endingMainText"));
    __publicField(this, "endingMenuButtonDivs", Array.from(document.querySelectorAll(".endingMenuButton")));
    __publicField(this, "endingDeathRestartButtonDiv", document.getElementById("endingDeathRestartButton"));
    __publicField(this, "endingWinRestartButtonDiv", document.getElementById("endingWinRestartButton"));
    __publicField(this, "endingNextMapButtonDiv", document.getElementById("endingNextMapButton"));
    __publicField(this, "endingDeathInfoDiv", document.getElementById("endingDeathInfo"));
    __publicField(this, "endingWinInfoDiv", document.getElementById("endingWinInfo"));
    __publicField(this, "endingHelpDiv", document.getElementById("endingHelp"));
    __publicField(this, "endingTimeDiv", document.getElementById("endingTime"));
    __publicField(this, "didWin", false);
    __publicField(this, "showedEndingAtMs", 0);
    this.world = world;
    this.endingDeathRestartButtonDiv.onclick = () => this.onRestartButtonClicked();
    this.endingWinRestartButtonDiv.onclick = () => this.onRestartButtonClicked();
    for (const endingMenuButtonDiv of this.endingMenuButtonDivs) {
      endingMenuButtonDiv.onclick = () => this.world.overlayManager.onMenuButtonClicked();
    }
    this.endingNextMapButtonDiv.onclick = () => this.onNextMapButtonClicked();
    this.endingDeathInfoDiv.onclick = () => this.onInfoButtonClicked();
    this.endingWinInfoDiv.onclick = () => this.onInfoButtonClicked();
    this.endingHelpDiv.onclick = () => this.onHelpButtonClicked();
  }
  onMapLoaded() {
    this.writeMapAndMakerName(this.getCupId());
  }
  getCupId() {
    if (this.world.mainState == null)
      return CupIdEnum.Brew;
    if (this.world.mainState.mapListing == null)
      return CupIdEnum.Brew;
    return this.world.mainState.mapListing.cupId;
  }
  async onDeath(deathMessage) {
    if (!window.isMapLoaded)
      return;
    this.showEnding(false);
    this.world.overlayManager.hideInGameMessage();
    this.endingMainTextDiv.innerText = deathMessage;
    this.endingMainTextDiv.style.color = ColorEnum.Red;
    this.world.soundPlayer.stopBackgroundMusic();
    this.world.soundPlayer.playSound(SoundFileEnum.Death);
    const shouldDisplayJumpEnabledPopup = await this.getShouldDisplayJumpEnabledPopup();
    if (shouldDisplayJumpEnabledPopup)
      this.displayJumpEnabledPopup();
    const shouldDisplayDriftEnabledPopup = await this.getShouldDisplayDriftEnabledPopup();
    if (shouldDisplayDriftEnabledPopup)
      this.displayDriftEnabledPopup();
    const didDisplayControlChangePopup = shouldDisplayJumpEnabledPopup || shouldDisplayDriftEnabledPopup;
    if (window.sponsorManager != null)
      window.sponsorManager.onDeath();
    const { didStartPreroll } = window.bagManager == null ? { didStartPreroll: false } : window.bagManager.videoBagManager.onDeath();
    const { didAutoRestart } = await this.autoRestartOnDeath(didStartPreroll, didDisplayControlChangePopup);
    if (!didAutoRestart && window.bagManager != null) {
      window.bagManager.reloadManager.reloadDisplayBags(true);
    }
  }
  async autoRestartOnDeath(didStartPreroll, didDisplayControlChangePopup) {
    if (didStartPreroll)
      return { didAutoRestart: false };
    if (didDisplayControlChangePopup)
      return { didAutoRestart: false };
    if (this.world.mainState == null)
      return { didAutoRestart: false };
    const autoRestartSettings = await FStorage.getString(StorageKeyEnum.IsAutoRestartOn);
    if (autoRestartSettings !== StorageValueEnum.On)
      return { didAutoRestart: false };
    if (this.world.mainState.pageId !== PageIdEnum.Game)
      return { didAutoRestart: false };
    this.onRestartButtonClicked();
    return { didAutoRestart: true };
  }
  async onWin() {
    if (!window.isMapLoaded)
      return;
    this.showEnding(true);
    this.endingMainTextDiv.innerText = "Map Complete";
    this.endingMainTextDiv.style.color = ColorEnum.Green;
    this.world.soundPlayer.stopBackgroundMusic();
    this.world.soundPlayer.playSound(SoundFileEnum.LevelComplete);
    if (this.world.mainState == null || this.world.mainState.mapListing == null) {
      this.world.createPopupItem(FSinglePopupManager.createBrewMapCompleteNotSavedPopupItem());
      return;
    }
    const currentMapId = this.world.mainState.mapListing.mapId;
    const previousTime = this.world.mainState.mapCompletionDictionary[currentMapId].time;
    const currentTime = window.score;
    await CompletedMapUtils.onMapCompleted(currentMapId, currentTime);
    const mainStateChange = await this.world.reloadMainState();
    this.world.overlayManager.updateBestTime();
    const winPopupItem = this.getWinPopupItem(mainStateChange, previousTime, currentTime);
    if (winPopupItem != null)
      this.world.createPopupItem(winPopupItem);
    if (window.bagManager != null)
      window.bagManager.videoBagManager.onWin();
  }
  getWinPopupItem(mainStateChange, previousTime, currentTime) {
    if (mainStateChange.didGraduateNewcomer)
      return PopupItemCreator.newcomerGraduation();
    if (mainStateChange.didUnlockUltrahardCup)
      return PopupItemCreator.ultrahardUnlocked();
    if (mainStateChange.unlockedSkinId != null)
      return PopupItemCreator.skinUnlocked(mainStateChange.unlockedSkinId);
    if (FSingleEndingManager.isNewSpeedrun(previousTime, currentTime))
      return FSinglePopupManager.createSpeedrunPopupItem(previousTime, currentTime);
    return null;
  }
  static isNewSpeedrun(previousTime, newTime) {
    if (previousTime == Infinity)
      return false;
    return newTime < previousTime;
  }
  async getShouldDisplayDriftEnabledPopup() {
    if (this.world.mainState == null || this.world.mainState.mapListing == null)
      return false;
    if (this.world.overlayManager.mapIdWithControlChangeEndingPopup === this.world.mainState.mapListing.mapId)
      return false;
    if (!this.world.overlayManager.didEncounterDriftRegion)
      return false;
    const shouldNotShowAgain = await FStorage.getString(StorageKeyEnum.DoNotShowDriftEnabledPopupAgain);
    if (shouldNotShowAgain === StorageValueEnum.On)
      return false;
    return true;
  }
  displayDriftEnabledPopup() {
    if (this.world.mainState == null || this.world.mainState.mapListing == null)
      return;
    this.world.overlayManager.mapIdWithControlChangeEndingPopup = this.world.mainState.mapListing.mapId;
    this.world.createPopupItem({
      title: "Drifting Map",
      bodyAsHtml: "You can drift in some parts of this map. Hold shift to drift around corners.",
      buttons: [{
        text: CLOSE_BUTTON_TEXT,
        onClick: () => {
        }
      }, {
        text: "Don't show again",
        onClick: () => {
          void FStorage.set(StorageKeyEnum.DoNotShowDriftEnabledPopupAgain, StorageValueEnum.On);
        }
      }]
    });
  }
  async getShouldDisplayJumpEnabledPopup() {
    if (this.world.mainState == null || this.world.mainState.mapListing == null)
      return false;
    if (this.world.overlayManager.mapIdWithControlChangeEndingPopup === this.world.mainState.mapListing.mapId)
      return false;
    if (!this.world.overlayManager.didEncounterJumpRegion)
      return false;
    const shouldNotShowAgain = await FStorage.getString(StorageKeyEnum.DoNotShowJumpEnabledPopupAgain);
    if (shouldNotShowAgain === StorageValueEnum.On)
      return false;
    return true;
  }
  displayJumpEnabledPopup() {
    if (this.world.mainState == null || this.world.mainState.mapListing == null)
      return false;
    this.world.overlayManager.mapIdWithControlChangeEndingPopup = this.world.mainState.mapListing.mapId;
    this.world.createPopupItem({
      title: "Jumping Map",
      bodyAsHtml: "You can jump in some parts of this map. Press spacebar to jump.",
      buttons: [{
        text: CLOSE_BUTTON_TEXT,
        onClick: () => {
        }
      }, {
        text: "Don't show again",
        onClick: () => {
          void FStorage.set(StorageKeyEnum.DoNotShowJumpEnabledPopupAgain, StorageValueEnum.On);
        }
      }]
    });
  }
  onSpacePressed() {
    if (window.alive)
      return;
    if (this.didWin) {
      this.onNextMapButtonClicked();
    } else {
      this.onRestartButtonClicked();
    }
  }
  showEnding(didWin) {
    this.showedEndingAtMs = Date.now();
    this.didWin = didWin;
    this.endingDiv.style.display = "flex";
    this.endingTimeDiv.innerText = "Time: " + window.score.toString();
    const divIdForShow = didWin ? "endingWinActions" : "endingDeathActions";
    const divIdForHide = didWin ? "endingDeathActions" : "endingWinActions";
    const divToShow = document.getElementById(divIdForShow);
    const divToHide = document.getElementById(divIdForHide);
    divToShow.style.display = "inline-flex";
    divToHide.style.display = "none";
    this.world.overlayManager.hideAllSigns();
    this.world.overlayManager.onEndingScreenShow();
  }
  hideEnding() {
    this.endingDiv.style.display = "none";
    this.world.overlayManager.onEndingScreenHide();
  }
  onHelpButtonClicked() {
    this.world.createPopupItem(FSinglePopupManager.createInGameHelpPopupItem());
  }
  onRestartButtonClicked() {
    if (window.alive)
      return;
    this.hideEnding();
    change_state.spawn();
    this.world.soundPlayer.playBackgroundMusic();
    this.world.overlayManager.onMapLoaded();
    this.world.playerManager.driftManager.onRestart();
  }
  async onNextMapButtonClicked() {
    if (!this.canChangePageOrMap())
      return;
    await this.startChangingPageOrMap();
    if (this.world.mainState == null || this.world.mainState.mapListing == null)
      return;
    this.world.onClickMap(MapUtils.getNextMapListing(this.world.mainState.mapListing, DeploymentUtils.isExtension()));
  }
  async onInfoButtonClicked() {
    if (!this.canChangePageOrMap())
      return;
    await this.startChangingPageOrMap();
    if (this.world.mainState == null || this.world.mainState.mapListing == null)
      return;
    const queryText = "?mapId=" + this.world.mainState.mapListing.mapId;
    UrlUtils.goToRoute(RouteEnum.Info, queryText);
  }
  canChangePageOrMap() {
    if (window.alive)
      return false;
    if (!window.isMapLoaded)
      return false;
    if (this.world.overlayManager.isLoadingScreenVisible())
      return false;
    if (this.world.isBrewCupMap()) {
      this.world.popupManager.displayBrewCupActionBlockedPopup();
      return false;
    }
    const didShowEndingTooRecently = Date.now() - this.showedEndingAtMs < 200;
    if (didShowEndingTooRecently)
      return false;
    return true;
  }
  startChangingPageOrMap() {
    this.hideEnding();
    this.world.overlayManager.showLoadingScreen();
    this.world.objectManager.onCleanup();
    return MiscUtils.getSmallDelay();
  }
}
const NORMAL_ANGULAR_ACCELERATION = 3e-3;
const NORMAL_MAX_ANGULAR_SPEED = 0.05;
const DRIFT_MAX_ANGULAR_ACCELERATION = 0.014;
const DRIFT_MIN_ANGULAR_ACCELERATION = 7e-3;
const DRIFT_MAX_ANGULAR_SPEED = 0.09;
const DRIFT_MIN_ANGULAR_SPEED = 0.01;
const DRIFT_IGNORE_INPUT_FRAMES = 15;
const BOOST_SPEED_MULTIPLIER = 1.8;
const BOOST_SPEED_MIN_FRAMES = 60 * 0.25;
const BOOST_SPEED_MAX_FRAMES = 60 * 0.7;
const SIDESTEP_ANGLE_OFFSET_MAX = Math.PI * 0.28;
const SIDESTEP_ANGLE_OFFSET_MIN = Math.PI * 0.16;
const SIDESTEP_ANGLE_OFFSET_CHANGE_RATE = Math.PI * 0.06;
class FDriftManager {
  constructor(world, playerManager) {
    __publicField(this, "world");
    __publicField(this, "playerManager");
    __publicField(this, "angularVelocity", 0);
    __publicField(this, "forwardVelocity", 0);
    __publicField(this, "isDrifting", false);
    __publicField(this, "sidestepAngleOffset", 0);
    __publicField(this, "driftDirection", 1);
    __publicField(this, "driftDurationInFrames", 0);
    __publicField(this, "speedDurationInFrames", 0);
    this.world = world;
    this.playerManager = playerManager;
  }
  onFrame() {
    const steeringDirection = FBasePlayerManager.getSteeringDirection();
    this.startDrift(steeringDirection);
    this.stopDrift();
    this.forwardVelocity = this.getForwardVelocity();
    this.updateAngularVelocity(steeringDirection);
    this.updateSideStepAngleOffset();
    if (this.isDrifting)
      this.driftDurationInFrames += 1;
    if (this.speedDurationInFrames > 0)
      this.speedDurationInFrames -= 1;
  }
  onRestart() {
    this.angularVelocity = 0;
    this.forwardVelocity = 0;
    this.isDrifting = false;
    this.sidestepAngleOffset = 0;
    this.driftDirection = 1;
    this.driftDurationInFrames = 0;
    this.speedDurationInFrames = 0;
  }
  updateSideStepAngleOffset() {
    if (!this.isDrifting)
      return;
    if (this.driftDirection === -1) {
      if (this.sidestepAngleOffset > SIDESTEP_ANGLE_OFFSET_MIN)
        this.sidestepAngleOffset -= SIDESTEP_ANGLE_OFFSET_CHANGE_RATE;
    }
    if (this.driftDirection === 1) {
      if (this.sidestepAngleOffset < -SIDESTEP_ANGLE_OFFSET_MIN)
        this.sidestepAngleOffset += SIDESTEP_ANGLE_OFFSET_CHANGE_RATE;
    }
  }
  updateAngularVelocity(steeringDirection) {
    this.angularVelocity *= this.getAngularSpeedDamping();
    if (!this.isDrifting) {
      this.angularVelocity += steeringDirection * NORMAL_ANGULAR_ACCELERATION;
      if (this.angularVelocity > NORMAL_MAX_ANGULAR_SPEED)
        this.angularVelocity = NORMAL_MAX_ANGULAR_SPEED;
      if (this.angularVelocity < -NORMAL_MAX_ANGULAR_SPEED)
        this.angularVelocity = -NORMAL_MAX_ANGULAR_SPEED;
      return;
    }
    if (this.driftDurationInFrames > DRIFT_IGNORE_INPUT_FRAMES) {
      console.log("yes");
      if (steeringDirection === this.driftDirection) {
        this.angularVelocity += steeringDirection * DRIFT_MIN_ANGULAR_ACCELERATION;
      } else {
        this.angularVelocity += steeringDirection * DRIFT_MAX_ANGULAR_ACCELERATION;
      }
    } else {
      console.log("no");
    }
    if (this.driftDirection === 1) {
      if (this.angularVelocity > DRIFT_MAX_ANGULAR_SPEED)
        this.angularVelocity = DRIFT_MAX_ANGULAR_SPEED;
      if (this.angularVelocity < DRIFT_MIN_ANGULAR_SPEED)
        this.angularVelocity = DRIFT_MIN_ANGULAR_SPEED;
    }
    if (this.driftDirection === -1) {
      if (this.angularVelocity < -DRIFT_MAX_ANGULAR_SPEED)
        this.angularVelocity = -DRIFT_MAX_ANGULAR_SPEED;
      if (this.angularVelocity > -DRIFT_MIN_ANGULAR_SPEED)
        this.angularVelocity = -DRIFT_MIN_ANGULAR_SPEED;
    }
  }
  getForwardVelocity() {
    return this.isDrifting ? 0.25 : 0.3;
  }
  getAngularSpeedDamping() {
    return this.isDrifting ? 0.93 : 0.93;
  }
  getRotationAdjustment() {
    let adjustment = this.angularVelocity;
    if (this.isDrifting)
      adjustment *= window.speed * 1.9;
    return adjustment;
  }
  getPositionAdjustment() {
    let angle = window.rotation - Math.PI;
    let speed = this.forwardVelocity;
    // let speed = 1000;
    if (this.speedDurationInFrames > 0)
      speed *= BOOST_SPEED_MULTIPLIER;
    angle += this.sidestepAngleOffset;
    return {
      x: speed * Math.sin(angle),
      z: speed * Math.cos(angle)
    };
  }
  startDrift(steeringDirection) {
    if (this.isDrifting)
      return;
    if (steeringDirection === 0)
      return;
    if (!window.controls.down)
      return;
    this.isDrifting = true;
    this.driftDirection = steeringDirection;
    this.angularVelocity = steeringDirection * 0.07;
    this.sidestepAngleOffset = steeringDirection * -SIDESTEP_ANGLE_OFFSET_MAX;
    this.speedDurationInFrames = 1000;
    this.driftDurationInFrames = 0;
  }
  stopDrift() {
    if (!this.isDrifting)
      return;
    if (window.controls.down)
      return;
    this.isDrifting = false;
    this.sidestepAngleOffset = 0;
    this.angularVelocity = 0;
    this.speedDurationInFrames = this.getSpeedDurationInFrames();
    this.driftDurationInFrames = 0;
  }
  getSpeedDurationInFrames() {
    const value = this.driftDurationInFrames / 3;
    if (value > BOOST_SPEED_MAX_FRAMES)
      return BOOST_SPEED_MAX_FRAMES;
    if (value < BOOST_SPEED_MIN_FRAMES)
      return BOOST_SPEED_MIN_FRAMES;
    return Math.ceil(value);
  }
}
let steerControl = 1;
class FMoveManager {
  constructor(world, playerManager) {
    __publicField(this, "world");
    __publicField(this, "playerManager");
    this.world = world;
    this.playerManager = playerManager;
  }
  getRotationAdjustment() {
    return window.steer * FBasePlayerManager.getSteeringDirection() * window.steerControl;
  }
  getPositionAdjustment() {
    return {
      x: window.speed * Math.sin(window.rotation - 3.14),
      z: window.speed * Math.cos(window.rotation - 3.14)
    };
  }
}
class FBasePlayerManager {
  constructor(world) {
    __publicField(this, "world");
    __publicField(this, "driftManager");
    __publicField(this, "moveManager");
    this.world = world;
    this.driftManager = new FDriftManager(world, this);
    this.moveManager = new FMoveManager(world, this);
  }
  onFrame() {
    if (window.isTouchingDriftPad)
      this.driftManager.onFrame();
  }
  getRotationAdjustment() {
    return window.isTouchingDriftPad ? this.driftManager.getRotationAdjustment() : this.moveManager.getRotationAdjustment();
  }
  getPositionAdjustment() {
    return window.isTouchingDriftPad ? this.driftManager.getPositionAdjustment() : this.moveManager.getPositionAdjustment();
  }
  static getSteeringDirection() {
    let direction = 0;
    if (window.controls.right)
      direction += 1;
    if (window.controls.left)
      direction -= 1;
    return direction;
  }
}
class FSinglePlayerManager extends FBasePlayerManager {
  constructor(world) {
    super(world);
    __publicField(this, "driftManager");
    __publicField(this, "moveManager");
    this.driftManager = new FDriftManager(world, this);
    this.moveManager = new FMoveManager(world, this);
  }
  onFrame() {
    super.onFrame();
  }
}
class FBaseOverlayManager {
  constructor() {
    __publicField(this, "overlayMapNameDiv", document.getElementById("overlayMapName"));
    __publicField(this, "overlayInGameMessageDiv", document.getElementById("overlayInGameMessage"));
    __publicField(this, "overlayLoadingScreenDiv", document.getElementById("overlayLoadingScreen"));
    __publicField(this, "overlayCurrentTimeDiv", document.getElementById("overlayCurrentTime"));
    __publicField(this, "overlayFpsDiv", document.getElementById("overlayFps"));
    __publicField(this, "mapIdWithControlChangeEndingPopup", "none");
    __publicField(this, "didEncounterJumpRegion", false);
    __publicField(this, "didEncounterDriftRegion", false);
    this.hideAllSigns();
  }
  updateCurrentTime() {
    this.overlayCurrentTimeDiv.innerHTML = "TIME: " + window.score;
  }
  onMapLoaded() {
    this.didEncounterJumpRegion = false;
    this.didEncounterDriftRegion = false;
    this.overlayMapNameDiv.innerText = map.title;
    this.hideLoadingScreen();
    this.hideInGameMessage();
  }
  hideAllSigns() {
    this.setJumpEnabledSignVisibility(false);
    this.setPlatformerSignVisibility(false)
    this.setControlsReversedSignVisibility(false);
    this.setDriftEnabledSignVisibility(false);
  }
  updateFpsText(fps) {
    this.overlayFpsDiv.innerText = fps.toFixed(0) + " FPS";
  }
  setInGameMessage(message) {
    this.overlayInGameMessageDiv.innerText = message;
    this.overlayInGameMessageDiv.style.display = "block";
  }
  hideInGameMessage() {
    this.overlayInGameMessageDiv.innerText = "";
    this.overlayInGameMessageDiv.style.display = "none";
  }
  showLoadingScreen() {
    this.overlayLoadingScreenDiv.style.display = "flex";
  }
  hideLoadingScreen() {
    this.overlayLoadingScreenDiv.style.display = "none";
  }
  isLoadingScreenVisible() {
    return this.overlayLoadingScreenDiv.style.display === "flex";
  }
  setJumpEnabledSignVisibility(isVisible) {
    const overlayJumpEnabledDiv = document.getElementById("overlayJumpEnabled");
    overlayJumpEnabledDiv.style.visibility = isVisible ? "visible" : "hidden";
    if (isVisible)
      this.didEncounterJumpRegion = true;
  }
  setPlatformerSignVisibility(isVisible) {
    const overlayPlatformerEnabledDiv = document.getElementById("overlayPlatformerEnabled");
    overlayPlatformerEnabledDiv.style.visibility = isVisible ? "visible" : "hidden";
    window.platformermode = isVisible ? true : false;
    if (isVisible)
      this.didEncounterJumpRegion = true;
  }
  setDriftEnabledSignVisibility(isVisible) {
    const overlayDriftEnabledDiv = document.getElementById("overlayDriftEnabled");
    overlayDriftEnabledDiv.style.visibility = isVisible ? "visible" : "hidden";
    if (isVisible)
      this.didEncounterDriftRegion = true;
  }
  setControlsReversedSignVisibility(isVisible) {
    const overlayControlsReversedDiv = document.getElementById("overlayControlsReversed");
    overlayControlsReversedDiv.style.visibility = isVisible ? "visible" : "hidden";
  }
}
class FSingleOverlayManager extends FBaseOverlayManager {
  constructor(world) {
    super();
    __publicField(this, "world");
    __publicField(this, "overlayBestTimeDiv", document.getElementById("overlayBestTime"));
    __publicField(this, "overlayMenuButtonDiv", document.getElementById("overlayMenuButton"));
    this.world = world;
    this.overlayMenuButtonDiv.onclick = () => this.onMenuButtonClicked();
  }
  onFrame() {
    this.updateCurrentTime();
  }
  onMapLoaded() {
    super.onMapLoaded();
    this.updateBestTime();
  }
  updateBestTime() {
    if (this.world.mainState.mapListing == null)
      return;
    const currentMapId = this.world.mainState.mapListing.mapId;
    const mapCompletion = this.world.mainState.mapCompletionDictionary[currentMapId];
    this.overlayBestTimeDiv.innerText = mapCompletion.count === 0 ? "" : "BEST: " + mapCompletion.time;
  }
  onEndingScreenShow() {
    this.overlayCurrentTimeDiv.style.visibility = "hidden";
    this.overlayBestTimeDiv.style.visibility = "hidden";
    this.overlayMapNameDiv.style.visibility = "hidden";
    this.overlayFpsDiv.style.visibility = "hidden";
  }
  onEndingScreenHide() {
    this.overlayCurrentTimeDiv.style.visibility = "visible";
    this.overlayBestTimeDiv.style.visibility = "visible";
    this.overlayMapNameDiv.style.visibility = "visible";
    this.overlayFpsDiv.style.visibility = "visible";
  }
  async onMenuButtonClicked() {
    if (!window.isMapLoaded)
      return;
    if (this.isLoadingScreenVisible())
      return;
    if (this.world.isTestingMap()) {
      this.world.popupManager.displayTestMapActionBlockedPopup();
      return;
    }
    this.showLoadingScreen();
    this.world.endingManager.hideEnding();
    this.world.soundPlayer.stopBackgroundMusic();
    this.world.soundPlayer.playMenuMusic();
    this.world.objectManager.onCleanup();
    await MiscUtils.getSmallDelay();
    this.world.returnToMenuFromGame();
  }
}
async function GetMap(mapId, mapUrl, cupId, num){
    // let meshes = scene.getMeshesByTags("mesh")
    // for(let i = 0;i < meshes.length;i++) {
    //     meshes[i].dispose();
    // }
    try{document.getElementById("map-script").remove();}
    catch{}
    let scriptUrl = "";
    await FMapLoader.getUrl(mapId, mapUrl, cupId, num).then(result => {
        console.log(result);
        scriptUrl = result;
    });
    await FMapLoader.loadScript(scriptUrl, cupId);
}
class FMapLoader {
  static async loadMap(mapId, mapUrl, cupId, num) {
    if (window.isMapLoaded) {
      console.error("Map already loaded");
      return;
    }
    window.currentMapId = mapId;
    window.isMapLoaded = true;
    await GetMap(mapId, mapUrl, cupId, num)
  }
  static async loadScript(scriptUrl, cupId) {
    return new Promise((resolve2) => {
      const head = document.getElementsByTagName("head")[0];
      const script = document.createElement("script");
      script.type = "text/javascript";
      if (scriptUrl.substring(0,4) == "/map") {script.src = scriptUrl;}
      else {script.innerHTML = scriptUrl;}
      script.id = "map-script";
      head.appendChild(script);
      setTimeout(resolve2, 500);
    //   cleanup.run();
    });
  }
    static async getUrl(mapId, mapUrl, cupId, num) {
        // console.log(mapUrl);
        if (mapUrl == null) {
            // alert("was null");
            const customMap = JSON.parse(localStorage.getItem("CustomMaps"));
            for (let i in customMap) {
                if (customMap[i].id === mapId) {
                    return customMap[i].map;
                }
            }

            let fetchUrl = '';
            switch (cupId) {
                case 0:
                    fetchUrl = '../JSON cups/newcomerCup.json';
                    break;
                case 31:
                    fetchUrl = '../JSON cups/dodoCup.json';
                    break;
                default:
                    return `/maps/${mapId}.js`;
            }

            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched JSON Data:', data); // Log the entire JSON data
            return data[num];
        }

        if (mapUrl.startsWith("http://") || mapUrl.startsWith("https://")) {
            return mapUrl;
        }
        return `${window.icemaprunlink}?${LATEST_MAP_CODE_VERSION}=${mapUrl}`;
    }
}
/*!
 * @pixi/settings - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/settings is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*!
 * @pixi/constants - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ENV$1;
(function(ENV2) {
  ENV2[ENV2["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
  ENV2[ENV2["WEBGL"] = 1] = "WEBGL";
  ENV2[ENV2["WEBGL2"] = 2] = "WEBGL2";
})(ENV$1 || (ENV$1 = {}));
var RENDERER_TYPE$1;
(function(RENDERER_TYPE2) {
  RENDERER_TYPE2[RENDERER_TYPE2["UNKNOWN"] = 0] = "UNKNOWN";
  RENDERER_TYPE2[RENDERER_TYPE2["WEBGL"] = 1] = "WEBGL";
  RENDERER_TYPE2[RENDERER_TYPE2["CANVAS"] = 2] = "CANVAS";
})(RENDERER_TYPE$1 || (RENDERER_TYPE$1 = {}));
var BUFFER_BITS$1;
(function(BUFFER_BITS2) {
  BUFFER_BITS2[BUFFER_BITS2["COLOR"] = 16384] = "COLOR";
  BUFFER_BITS2[BUFFER_BITS2["DEPTH"] = 256] = "DEPTH";
  BUFFER_BITS2[BUFFER_BITS2["STENCIL"] = 1024] = "STENCIL";
})(BUFFER_BITS$1 || (BUFFER_BITS$1 = {}));
var BLEND_MODES$1;
(function(BLEND_MODES2) {
  BLEND_MODES2[BLEND_MODES2["NORMAL"] = 0] = "NORMAL";
  BLEND_MODES2[BLEND_MODES2["ADD"] = 1] = "ADD";
  BLEND_MODES2[BLEND_MODES2["MULTIPLY"] = 2] = "MULTIPLY";
  BLEND_MODES2[BLEND_MODES2["SCREEN"] = 3] = "SCREEN";
  BLEND_MODES2[BLEND_MODES2["OVERLAY"] = 4] = "OVERLAY";
  BLEND_MODES2[BLEND_MODES2["DARKEN"] = 5] = "DARKEN";
  BLEND_MODES2[BLEND_MODES2["LIGHTEN"] = 6] = "LIGHTEN";
  BLEND_MODES2[BLEND_MODES2["COLOR_DODGE"] = 7] = "COLOR_DODGE";
  BLEND_MODES2[BLEND_MODES2["COLOR_BURN"] = 8] = "COLOR_BURN";
  BLEND_MODES2[BLEND_MODES2["HARD_LIGHT"] = 9] = "HARD_LIGHT";
  BLEND_MODES2[BLEND_MODES2["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
  BLEND_MODES2[BLEND_MODES2["DIFFERENCE"] = 11] = "DIFFERENCE";
  BLEND_MODES2[BLEND_MODES2["EXCLUSION"] = 12] = "EXCLUSION";
  BLEND_MODES2[BLEND_MODES2["HUE"] = 13] = "HUE";
  BLEND_MODES2[BLEND_MODES2["SATURATION"] = 14] = "SATURATION";
  BLEND_MODES2[BLEND_MODES2["COLOR"] = 15] = "COLOR";
  BLEND_MODES2[BLEND_MODES2["LUMINOSITY"] = 16] = "LUMINOSITY";
  BLEND_MODES2[BLEND_MODES2["NORMAL_NPM"] = 17] = "NORMAL_NPM";
  BLEND_MODES2[BLEND_MODES2["ADD_NPM"] = 18] = "ADD_NPM";
  BLEND_MODES2[BLEND_MODES2["SCREEN_NPM"] = 19] = "SCREEN_NPM";
  BLEND_MODES2[BLEND_MODES2["NONE"] = 20] = "NONE";
  BLEND_MODES2[BLEND_MODES2["SRC_OVER"] = 0] = "SRC_OVER";
  BLEND_MODES2[BLEND_MODES2["SRC_IN"] = 21] = "SRC_IN";
  BLEND_MODES2[BLEND_MODES2["SRC_OUT"] = 22] = "SRC_OUT";
  BLEND_MODES2[BLEND_MODES2["SRC_ATOP"] = 23] = "SRC_ATOP";
  BLEND_MODES2[BLEND_MODES2["DST_OVER"] = 24] = "DST_OVER";
  BLEND_MODES2[BLEND_MODES2["DST_IN"] = 25] = "DST_IN";
  BLEND_MODES2[BLEND_MODES2["DST_OUT"] = 26] = "DST_OUT";
  BLEND_MODES2[BLEND_MODES2["DST_ATOP"] = 27] = "DST_ATOP";
  BLEND_MODES2[BLEND_MODES2["ERASE"] = 26] = "ERASE";
  BLEND_MODES2[BLEND_MODES2["SUBTRACT"] = 28] = "SUBTRACT";
  BLEND_MODES2[BLEND_MODES2["XOR"] = 29] = "XOR";
})(BLEND_MODES$1 || (BLEND_MODES$1 = {}));
var DRAW_MODES$1;
(function(DRAW_MODES2) {
  DRAW_MODES2[DRAW_MODES2["POINTS"] = 0] = "POINTS";
  DRAW_MODES2[DRAW_MODES2["LINES"] = 1] = "LINES";
  DRAW_MODES2[DRAW_MODES2["LINE_LOOP"] = 2] = "LINE_LOOP";
  DRAW_MODES2[DRAW_MODES2["LINE_STRIP"] = 3] = "LINE_STRIP";
  DRAW_MODES2[DRAW_MODES2["TRIANGLES"] = 4] = "TRIANGLES";
  DRAW_MODES2[DRAW_MODES2["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
  DRAW_MODES2[DRAW_MODES2["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(DRAW_MODES$1 || (DRAW_MODES$1 = {}));
var FORMATS$1;
(function(FORMATS2) {
  FORMATS2[FORMATS2["RGBA"] = 6408] = "RGBA";
  FORMATS2[FORMATS2["RGB"] = 6407] = "RGB";
  FORMATS2[FORMATS2["RG"] = 33319] = "RG";
  FORMATS2[FORMATS2["RED"] = 6403] = "RED";
  FORMATS2[FORMATS2["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
  FORMATS2[FORMATS2["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
  FORMATS2[FORMATS2["RG_INTEGER"] = 33320] = "RG_INTEGER";
  FORMATS2[FORMATS2["RED_INTEGER"] = 36244] = "RED_INTEGER";
  FORMATS2[FORMATS2["ALPHA"] = 6406] = "ALPHA";
  FORMATS2[FORMATS2["LUMINANCE"] = 6409] = "LUMINANCE";
  FORMATS2[FORMATS2["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
  FORMATS2[FORMATS2["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
  FORMATS2[FORMATS2["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
})(FORMATS$1 || (FORMATS$1 = {}));
var TARGETS$1;
(function(TARGETS2) {
  TARGETS2[TARGETS2["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
  TARGETS2[TARGETS2["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(TARGETS$1 || (TARGETS$1 = {}));
var TYPES$1;
(function(TYPES2) {
  TYPES2[TYPES2["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
  TYPES2[TYPES2["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
  TYPES2[TYPES2["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
  TYPES2[TYPES2["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
  TYPES2[TYPES2["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
  TYPES2[TYPES2["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
  TYPES2[TYPES2["UNSIGNED_INT_10F_11F_11F_REV"] = 35899] = "UNSIGNED_INT_10F_11F_11F_REV";
  TYPES2[TYPES2["UNSIGNED_INT_2_10_10_10_REV"] = 33640] = "UNSIGNED_INT_2_10_10_10_REV";
  TYPES2[TYPES2["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
  TYPES2[TYPES2["UNSIGNED_INT_5_9_9_9_REV"] = 35902] = "UNSIGNED_INT_5_9_9_9_REV";
  TYPES2[TYPES2["BYTE"] = 5120] = "BYTE";
  TYPES2[TYPES2["SHORT"] = 5122] = "SHORT";
  TYPES2[TYPES2["INT"] = 5124] = "INT";
  TYPES2[TYPES2["FLOAT"] = 5126] = "FLOAT";
  TYPES2[TYPES2["FLOAT_32_UNSIGNED_INT_24_8_REV"] = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
  TYPES2[TYPES2["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
})(TYPES$1 || (TYPES$1 = {}));
var SAMPLER_TYPES$1;
(function(SAMPLER_TYPES2) {
  SAMPLER_TYPES2[SAMPLER_TYPES2["FLOAT"] = 0] = "FLOAT";
  SAMPLER_TYPES2[SAMPLER_TYPES2["INT"] = 1] = "INT";
  SAMPLER_TYPES2[SAMPLER_TYPES2["UINT"] = 2] = "UINT";
})(SAMPLER_TYPES$1 || (SAMPLER_TYPES$1 = {}));
var SCALE_MODES$1;
(function(SCALE_MODES2) {
  SCALE_MODES2[SCALE_MODES2["NEAREST"] = 0] = "NEAREST";
  SCALE_MODES2[SCALE_MODES2["LINEAR"] = 1] = "LINEAR";
})(SCALE_MODES$1 || (SCALE_MODES$1 = {}));
var WRAP_MODES$1;
(function(WRAP_MODES2) {
  WRAP_MODES2[WRAP_MODES2["CLAMP"] = 33071] = "CLAMP";
  WRAP_MODES2[WRAP_MODES2["REPEAT"] = 10497] = "REPEAT";
  WRAP_MODES2[WRAP_MODES2["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(WRAP_MODES$1 || (WRAP_MODES$1 = {}));
var MIPMAP_MODES$1;
(function(MIPMAP_MODES2) {
  MIPMAP_MODES2[MIPMAP_MODES2["OFF"] = 0] = "OFF";
  MIPMAP_MODES2[MIPMAP_MODES2["POW2"] = 1] = "POW2";
  MIPMAP_MODES2[MIPMAP_MODES2["ON"] = 2] = "ON";
  MIPMAP_MODES2[MIPMAP_MODES2["ON_MANUAL"] = 3] = "ON_MANUAL";
})(MIPMAP_MODES$1 || (MIPMAP_MODES$1 = {}));
var ALPHA_MODES$1;
(function(ALPHA_MODES2) {
  ALPHA_MODES2[ALPHA_MODES2["NPM"] = 0] = "NPM";
  ALPHA_MODES2[ALPHA_MODES2["UNPACK"] = 1] = "UNPACK";
  ALPHA_MODES2[ALPHA_MODES2["PMA"] = 2] = "PMA";
  ALPHA_MODES2[ALPHA_MODES2["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
  ALPHA_MODES2[ALPHA_MODES2["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
  ALPHA_MODES2[ALPHA_MODES2["PREMULTIPLY_ALPHA"] = 2] = "PREMULTIPLY_ALPHA";
  ALPHA_MODES2[ALPHA_MODES2["PREMULTIPLIED_ALPHA"] = 2] = "PREMULTIPLIED_ALPHA";
})(ALPHA_MODES$1 || (ALPHA_MODES$1 = {}));
var CLEAR_MODES$1;
(function(CLEAR_MODES2) {
  CLEAR_MODES2[CLEAR_MODES2["NO"] = 0] = "NO";
  CLEAR_MODES2[CLEAR_MODES2["YES"] = 1] = "YES";
  CLEAR_MODES2[CLEAR_MODES2["AUTO"] = 2] = "AUTO";
  CLEAR_MODES2[CLEAR_MODES2["BLEND"] = 0] = "BLEND";
  CLEAR_MODES2[CLEAR_MODES2["CLEAR"] = 1] = "CLEAR";
  CLEAR_MODES2[CLEAR_MODES2["BLIT"] = 2] = "BLIT";
})(CLEAR_MODES$1 || (CLEAR_MODES$1 = {}));
var GC_MODES$1;
(function(GC_MODES2) {
  GC_MODES2[GC_MODES2["AUTO"] = 0] = "AUTO";
  GC_MODES2[GC_MODES2["MANUAL"] = 1] = "MANUAL";
})(GC_MODES$1 || (GC_MODES$1 = {}));
var PRECISION$1;
(function(PRECISION2) {
  PRECISION2["LOW"] = "lowp";
  PRECISION2["MEDIUM"] = "mediump";
  PRECISION2["HIGH"] = "highp";
})(PRECISION$1 || (PRECISION$1 = {}));
var MASK_TYPES$1;
(function(MASK_TYPES2) {
  MASK_TYPES2[MASK_TYPES2["NONE"] = 0] = "NONE";
  MASK_TYPES2[MASK_TYPES2["SCISSOR"] = 1] = "SCISSOR";
  MASK_TYPES2[MASK_TYPES2["STENCIL"] = 2] = "STENCIL";
  MASK_TYPES2[MASK_TYPES2["SPRITE"] = 3] = "SPRITE";
  MASK_TYPES2[MASK_TYPES2["COLOR"] = 4] = "COLOR";
})(MASK_TYPES$1 || (MASK_TYPES$1 = {}));
var COLOR_MASK_BITS$1;
(function(COLOR_MASK_BITS2) {
  COLOR_MASK_BITS2[COLOR_MASK_BITS2["RED"] = 1] = "RED";
  COLOR_MASK_BITS2[COLOR_MASK_BITS2["GREEN"] = 2] = "GREEN";
  COLOR_MASK_BITS2[COLOR_MASK_BITS2["BLUE"] = 4] = "BLUE";
  COLOR_MASK_BITS2[COLOR_MASK_BITS2["ALPHA"] = 8] = "ALPHA";
})(COLOR_MASK_BITS$1 || (COLOR_MASK_BITS$1 = {}));
var MSAA_QUALITY$1;
(function(MSAA_QUALITY2) {
  MSAA_QUALITY2[MSAA_QUALITY2["NONE"] = 0] = "NONE";
  MSAA_QUALITY2[MSAA_QUALITY2["LOW"] = 2] = "LOW";
  MSAA_QUALITY2[MSAA_QUALITY2["MEDIUM"] = 4] = "MEDIUM";
  MSAA_QUALITY2[MSAA_QUALITY2["HIGH"] = 8] = "HIGH";
})(MSAA_QUALITY$1 || (MSAA_QUALITY$1 = {}));
var BUFFER_TYPE$1;
(function(BUFFER_TYPE2) {
  BUFFER_TYPE2[BUFFER_TYPE2["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
  BUFFER_TYPE2[BUFFER_TYPE2["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
  BUFFER_TYPE2[BUFFER_TYPE2["UNIFORM_BUFFER"] = 35345] = "UNIFORM_BUFFER";
})(BUFFER_TYPE$1 || (BUFFER_TYPE$1 = {}));
var BrowserAdapter = {
  createCanvas: function(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },
  getWebGLRenderingContext: function() {
    return WebGLRenderingContext;
  },
  getNavigator: function() {
    return navigator;
  },
  getBaseUrl: function() {
    var _a;
    return (_a = document.baseURI) !== null && _a !== void 0 ? _a : window.location.href;
  },
  fetch: function(url2, options) {
    return fetch(url2, options);
  }
};
var appleIphone = /iPhone/i;
var appleIpod = /iPod/i;
var appleTablet = /iPad/i;
var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
var androidTablet = /Android/i;
var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
var amazonTablet = /Silk/i;
var windowsPhone = /Windows Phone/i;
var windowsTablet = /\bWindows(?:.+)ARM\b/i;
var otherBlackBerry = /BlackBerry/i;
var otherBlackBerry10 = /BB10/i;
var otherOpera = /Opera Mini/i;
var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
var otherFirefox = /Mobile(?:.+)Firefox\b/i;
var isAppleTabletOnIos13 = function(navigator2) {
  return typeof navigator2 !== "undefined" && navigator2.platform === "MacIntel" && typeof navigator2.maxTouchPoints === "number" && navigator2.maxTouchPoints > 1 && typeof MSStream === "undefined";
};
function createMatch(userAgent) {
  return function(regex) {
    return regex.test(userAgent);
  };
}
function isMobile$1(param) {
  var nav = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  if (!param && typeof navigator !== "undefined") {
    nav = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints || 0
    };
  } else if (typeof param === "string") {
    nav.userAgent = param;
  } else if (param && param.userAgent) {
    nav = {
      userAgent: param.userAgent,
      platform: param.platform,
      maxTouchPoints: param.maxTouchPoints || 0
    };
  }
  var userAgent = nav.userAgent;
  var tmp = userAgent.split("[FBAN");
  if (typeof tmp[1] !== "undefined") {
    userAgent = tmp[0];
  }
  tmp = userAgent.split("Twitter");
  if (typeof tmp[1] !== "undefined") {
    userAgent = tmp[0];
  }
  var match = createMatch(userAgent);
  var result = {
    apple: {
      phone: match(appleIphone) && !match(windowsPhone),
      ipod: match(appleIpod),
      tablet: !match(appleIphone) && (match(appleTablet) || isAppleTabletOnIos13(nav)) && !match(windowsPhone),
      universal: match(appleUniversal),
      device: (match(appleIphone) || match(appleIpod) || match(appleTablet) || match(appleUniversal) || isAppleTabletOnIos13(nav)) && !match(windowsPhone)
    },
    amazon: {
      phone: match(amazonPhone),
      tablet: !match(amazonPhone) && match(amazonTablet),
      device: match(amazonPhone) || match(amazonTablet)
    },
    android: {
      phone: !match(windowsPhone) && match(amazonPhone) || !match(windowsPhone) && match(androidPhone),
      tablet: !match(windowsPhone) && !match(amazonPhone) && !match(androidPhone) && (match(amazonTablet) || match(androidTablet)),
      device: !match(windowsPhone) && (match(amazonPhone) || match(amazonTablet) || match(androidPhone) || match(androidTablet)) || match(/\bokhttp\b/i)
    },
    windows: {
      phone: match(windowsPhone),
      tablet: match(windowsTablet),
      device: match(windowsPhone) || match(windowsTablet)
    },
    other: {
      blackberry: match(otherBlackBerry),
      blackberry10: match(otherBlackBerry10),
      opera: match(otherOpera),
      firefox: match(otherFirefox),
      chrome: match(otherChrome),
      device: match(otherBlackBerry) || match(otherBlackBerry10) || match(otherOpera) || match(otherFirefox) || match(otherChrome)
    },
    any: false,
    phone: false,
    tablet: false
  };
  result.any = result.apple.device || result.android.device || result.windows.device || result.other.device;
  result.phone = result.apple.phone || result.android.phone || result.windows.phone;
  result.tablet = result.apple.tablet || result.android.tablet || result.windows.tablet;
  return result;
}
var isMobile = isMobile$1(globalThis.navigator);
function canUploadSameBuffer() {
  return !isMobile.apple.device;
}
function maxRecommendedTextures(max) {
  var allowMax = true;
  if (isMobile.tablet || isMobile.phone) {
    if (isMobile.apple.device) {
      var match = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
      if (match) {
        var majorVersion = parseInt(match[1], 10);
        if (majorVersion < 11) {
          allowMax = false;
        }
      }
    }
    if (isMobile.android.device) {
      var match = navigator.userAgent.match(/Android\s([0-9.]*)/);
      if (match) {
        var majorVersion = parseInt(match[1], 10);
        if (majorVersion < 7) {
          allowMax = false;
        }
      }
    }
  }
  return allowMax ? max : 4;
}
var settings = {
  ADAPTER: BrowserAdapter,
  MIPMAP_TEXTURES: MIPMAP_MODES$1.POW2,
  ANISOTROPIC_LEVEL: 0,
  RESOLUTION: 1,
  FILTER_RESOLUTION: 1,
  FILTER_MULTISAMPLE: MSAA_QUALITY$1.NONE,
  SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),
  SPRITE_BATCH_SIZE: 4096,
  RENDER_OPTIONS: {
    view: null,
    antialias: false,
    autoDensity: false,
    backgroundColor: 0,
    backgroundAlpha: 1,
    useContextAlpha: true,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    width: 800,
    height: 600,
    legacy: false
  },
  GC_MODE: GC_MODES$1.AUTO,
  GC_MAX_IDLE: 60 * 60,
  GC_MAX_CHECK_COUNT: 60 * 10,
  WRAP_MODE: WRAP_MODES$1.CLAMP,
  SCALE_MODE: SCALE_MODES$1.LINEAR,
  PRECISION_VERTEX: PRECISION$1.HIGH,
  PRECISION_FRAGMENT: isMobile.apple.device ? PRECISION$1.HIGH : PRECISION$1.MEDIUM,
  CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),
  CREATE_IMAGE_BITMAP: false,
  ROUND_PIXELS: false
};
/*!
 * @pixi/constants - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ENV;
(function(ENV2) {
  ENV2[ENV2["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
  ENV2[ENV2["WEBGL"] = 1] = "WEBGL";
  ENV2[ENV2["WEBGL2"] = 2] = "WEBGL2";
})(ENV || (ENV = {}));
var RENDERER_TYPE;
(function(RENDERER_TYPE2) {
  RENDERER_TYPE2[RENDERER_TYPE2["UNKNOWN"] = 0] = "UNKNOWN";
  RENDERER_TYPE2[RENDERER_TYPE2["WEBGL"] = 1] = "WEBGL";
  RENDERER_TYPE2[RENDERER_TYPE2["CANVAS"] = 2] = "CANVAS";
})(RENDERER_TYPE || (RENDERER_TYPE = {}));
var BUFFER_BITS;
(function(BUFFER_BITS2) {
  BUFFER_BITS2[BUFFER_BITS2["COLOR"] = 16384] = "COLOR";
  BUFFER_BITS2[BUFFER_BITS2["DEPTH"] = 256] = "DEPTH";
  BUFFER_BITS2[BUFFER_BITS2["STENCIL"] = 1024] = "STENCIL";
})(BUFFER_BITS || (BUFFER_BITS = {}));
var BLEND_MODES;
(function(BLEND_MODES2) {
  BLEND_MODES2[BLEND_MODES2["NORMAL"] = 0] = "NORMAL";
  BLEND_MODES2[BLEND_MODES2["ADD"] = 1] = "ADD";
  BLEND_MODES2[BLEND_MODES2["MULTIPLY"] = 2] = "MULTIPLY";
  BLEND_MODES2[BLEND_MODES2["SCREEN"] = 3] = "SCREEN";
  BLEND_MODES2[BLEND_MODES2["OVERLAY"] = 4] = "OVERLAY";
  BLEND_MODES2[BLEND_MODES2["DARKEN"] = 5] = "DARKEN";
  BLEND_MODES2[BLEND_MODES2["LIGHTEN"] = 6] = "LIGHTEN";
  BLEND_MODES2[BLEND_MODES2["COLOR_DODGE"] = 7] = "COLOR_DODGE";
  BLEND_MODES2[BLEND_MODES2["COLOR_BURN"] = 8] = "COLOR_BURN";
  BLEND_MODES2[BLEND_MODES2["HARD_LIGHT"] = 9] = "HARD_LIGHT";
  BLEND_MODES2[BLEND_MODES2["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
  BLEND_MODES2[BLEND_MODES2["DIFFERENCE"] = 11] = "DIFFERENCE";
  BLEND_MODES2[BLEND_MODES2["EXCLUSION"] = 12] = "EXCLUSION";
  BLEND_MODES2[BLEND_MODES2["HUE"] = 13] = "HUE";
  BLEND_MODES2[BLEND_MODES2["SATURATION"] = 14] = "SATURATION";
  BLEND_MODES2[BLEND_MODES2["COLOR"] = 15] = "COLOR";
  BLEND_MODES2[BLEND_MODES2["LUMINOSITY"] = 16] = "LUMINOSITY";
  BLEND_MODES2[BLEND_MODES2["NORMAL_NPM"] = 17] = "NORMAL_NPM";
  BLEND_MODES2[BLEND_MODES2["ADD_NPM"] = 18] = "ADD_NPM";
  BLEND_MODES2[BLEND_MODES2["SCREEN_NPM"] = 19] = "SCREEN_NPM";
  BLEND_MODES2[BLEND_MODES2["NONE"] = 20] = "NONE";
  BLEND_MODES2[BLEND_MODES2["SRC_OVER"] = 0] = "SRC_OVER";
  BLEND_MODES2[BLEND_MODES2["SRC_IN"] = 21] = "SRC_IN";
  BLEND_MODES2[BLEND_MODES2["SRC_OUT"] = 22] = "SRC_OUT";
  BLEND_MODES2[BLEND_MODES2["SRC_ATOP"] = 23] = "SRC_ATOP";
  BLEND_MODES2[BLEND_MODES2["DST_OVER"] = 24] = "DST_OVER";
  BLEND_MODES2[BLEND_MODES2["DST_IN"] = 25] = "DST_IN";
  BLEND_MODES2[BLEND_MODES2["DST_OUT"] = 26] = "DST_OUT";
  BLEND_MODES2[BLEND_MODES2["DST_ATOP"] = 27] = "DST_ATOP";
  BLEND_MODES2[BLEND_MODES2["ERASE"] = 26] = "ERASE";
  BLEND_MODES2[BLEND_MODES2["SUBTRACT"] = 28] = "SUBTRACT";
  BLEND_MODES2[BLEND_MODES2["XOR"] = 29] = "XOR";
})(BLEND_MODES || (BLEND_MODES = {}));
var DRAW_MODES;
(function(DRAW_MODES2) {
  DRAW_MODES2[DRAW_MODES2["POINTS"] = 0] = "POINTS";
  DRAW_MODES2[DRAW_MODES2["LINES"] = 1] = "LINES";
  DRAW_MODES2[DRAW_MODES2["LINE_LOOP"] = 2] = "LINE_LOOP";
  DRAW_MODES2[DRAW_MODES2["LINE_STRIP"] = 3] = "LINE_STRIP";
  DRAW_MODES2[DRAW_MODES2["TRIANGLES"] = 4] = "TRIANGLES";
  DRAW_MODES2[DRAW_MODES2["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
  DRAW_MODES2[DRAW_MODES2["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(DRAW_MODES || (DRAW_MODES = {}));
var FORMATS;
(function(FORMATS2) {
  FORMATS2[FORMATS2["RGBA"] = 6408] = "RGBA";
  FORMATS2[FORMATS2["RGB"] = 6407] = "RGB";
  FORMATS2[FORMATS2["RG"] = 33319] = "RG";
  FORMATS2[FORMATS2["RED"] = 6403] = "RED";
  FORMATS2[FORMATS2["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
  FORMATS2[FORMATS2["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
  FORMATS2[FORMATS2["RG_INTEGER"] = 33320] = "RG_INTEGER";
  FORMATS2[FORMATS2["RED_INTEGER"] = 36244] = "RED_INTEGER";
  FORMATS2[FORMATS2["ALPHA"] = 6406] = "ALPHA";
  FORMATS2[FORMATS2["LUMINANCE"] = 6409] = "LUMINANCE";
  FORMATS2[FORMATS2["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
  FORMATS2[FORMATS2["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
  FORMATS2[FORMATS2["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
})(FORMATS || (FORMATS = {}));
var TARGETS;
(function(TARGETS2) {
  TARGETS2[TARGETS2["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
  TARGETS2[TARGETS2["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
  TARGETS2[TARGETS2["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(TARGETS || (TARGETS = {}));
var TYPES;
(function(TYPES2) {
  TYPES2[TYPES2["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
  TYPES2[TYPES2["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
  TYPES2[TYPES2["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
  TYPES2[TYPES2["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
  TYPES2[TYPES2["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
  TYPES2[TYPES2["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
  TYPES2[TYPES2["UNSIGNED_INT_10F_11F_11F_REV"] = 35899] = "UNSIGNED_INT_10F_11F_11F_REV";
  TYPES2[TYPES2["UNSIGNED_INT_2_10_10_10_REV"] = 33640] = "UNSIGNED_INT_2_10_10_10_REV";
  TYPES2[TYPES2["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
  TYPES2[TYPES2["UNSIGNED_INT_5_9_9_9_REV"] = 35902] = "UNSIGNED_INT_5_9_9_9_REV";
  TYPES2[TYPES2["BYTE"] = 5120] = "BYTE";
  TYPES2[TYPES2["SHORT"] = 5122] = "SHORT";
  TYPES2[TYPES2["INT"] = 5124] = "INT";
  TYPES2[TYPES2["FLOAT"] = 5126] = "FLOAT";
  TYPES2[TYPES2["FLOAT_32_UNSIGNED_INT_24_8_REV"] = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
  TYPES2[TYPES2["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
})(TYPES || (TYPES = {}));
var SAMPLER_TYPES;
(function(SAMPLER_TYPES2) {
  SAMPLER_TYPES2[SAMPLER_TYPES2["FLOAT"] = 0] = "FLOAT";
  SAMPLER_TYPES2[SAMPLER_TYPES2["INT"] = 1] = "INT";
  SAMPLER_TYPES2[SAMPLER_TYPES2["UINT"] = 2] = "UINT";
})(SAMPLER_TYPES || (SAMPLER_TYPES = {}));
var SCALE_MODES;
(function(SCALE_MODES2) {
  SCALE_MODES2[SCALE_MODES2["NEAREST"] = 0] = "NEAREST";
  SCALE_MODES2[SCALE_MODES2["LINEAR"] = 1] = "LINEAR";
})(SCALE_MODES || (SCALE_MODES = {}));
var WRAP_MODES;
(function(WRAP_MODES2) {
  WRAP_MODES2[WRAP_MODES2["CLAMP"] = 33071] = "CLAMP";
  WRAP_MODES2[WRAP_MODES2["REPEAT"] = 10497] = "REPEAT";
  WRAP_MODES2[WRAP_MODES2["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(WRAP_MODES || (WRAP_MODES = {}));
var MIPMAP_MODES;
(function(MIPMAP_MODES2) {
  MIPMAP_MODES2[MIPMAP_MODES2["OFF"] = 0] = "OFF";
  MIPMAP_MODES2[MIPMAP_MODES2["POW2"] = 1] = "POW2";
  MIPMAP_MODES2[MIPMAP_MODES2["ON"] = 2] = "ON";
  MIPMAP_MODES2[MIPMAP_MODES2["ON_MANUAL"] = 3] = "ON_MANUAL";
})(MIPMAP_MODES || (MIPMAP_MODES = {}));
var ALPHA_MODES;
(function(ALPHA_MODES2) {
  ALPHA_MODES2[ALPHA_MODES2["NPM"] = 0] = "NPM";
  ALPHA_MODES2[ALPHA_MODES2["UNPACK"] = 1] = "UNPACK";
  ALPHA_MODES2[ALPHA_MODES2["PMA"] = 2] = "PMA";
  ALPHA_MODES2[ALPHA_MODES2["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
  ALPHA_MODES2[ALPHA_MODES2["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
  ALPHA_MODES2[ALPHA_MODES2["PREMULTIPLY_ALPHA"] = 2] = "PREMULTIPLY_ALPHA";
  ALPHA_MODES2[ALPHA_MODES2["PREMULTIPLIED_ALPHA"] = 2] = "PREMULTIPLIED_ALPHA";
})(ALPHA_MODES || (ALPHA_MODES = {}));
var CLEAR_MODES;
(function(CLEAR_MODES2) {
  CLEAR_MODES2[CLEAR_MODES2["NO"] = 0] = "NO";
  CLEAR_MODES2[CLEAR_MODES2["YES"] = 1] = "YES";
  CLEAR_MODES2[CLEAR_MODES2["AUTO"] = 2] = "AUTO";
  CLEAR_MODES2[CLEAR_MODES2["BLEND"] = 0] = "BLEND";
  CLEAR_MODES2[CLEAR_MODES2["CLEAR"] = 1] = "CLEAR";
  CLEAR_MODES2[CLEAR_MODES2["BLIT"] = 2] = "BLIT";
})(CLEAR_MODES || (CLEAR_MODES = {}));
var GC_MODES;
(function(GC_MODES2) {
  GC_MODES2[GC_MODES2["AUTO"] = 0] = "AUTO";
  GC_MODES2[GC_MODES2["MANUAL"] = 1] = "MANUAL";
})(GC_MODES || (GC_MODES = {}));
var PRECISION;
(function(PRECISION2) {
  PRECISION2["LOW"] = "lowp";
  PRECISION2["MEDIUM"] = "mediump";
  PRECISION2["HIGH"] = "highp";
})(PRECISION || (PRECISION = {}));
var MASK_TYPES;
(function(MASK_TYPES2) {
  MASK_TYPES2[MASK_TYPES2["NONE"] = 0] = "NONE";
  MASK_TYPES2[MASK_TYPES2["SCISSOR"] = 1] = "SCISSOR";
  MASK_TYPES2[MASK_TYPES2["STENCIL"] = 2] = "STENCIL";
  MASK_TYPES2[MASK_TYPES2["SPRITE"] = 3] = "SPRITE";
  MASK_TYPES2[MASK_TYPES2["COLOR"] = 4] = "COLOR";
})(MASK_TYPES || (MASK_TYPES = {}));
var COLOR_MASK_BITS;
(function(COLOR_MASK_BITS2) {
  COLOR_MASK_BITS2[COLOR_MASK_BITS2["RED"] = 1] = "RED";
  COLOR_MASK_BITS2[COLOR_MASK_BITS2["GREEN"] = 2] = "GREEN";
  COLOR_MASK_BITS2[COLOR_MASK_BITS2["BLUE"] = 4] = "BLUE";
  COLOR_MASK_BITS2[COLOR_MASK_BITS2["ALPHA"] = 8] = "ALPHA";
})(COLOR_MASK_BITS || (COLOR_MASK_BITS = {}));
var MSAA_QUALITY;
(function(MSAA_QUALITY2) {
  MSAA_QUALITY2[MSAA_QUALITY2["NONE"] = 0] = "NONE";
  MSAA_QUALITY2[MSAA_QUALITY2["LOW"] = 2] = "LOW";
  MSAA_QUALITY2[MSAA_QUALITY2["MEDIUM"] = 4] = "MEDIUM";
  MSAA_QUALITY2[MSAA_QUALITY2["HIGH"] = 8] = "HIGH";
})(MSAA_QUALITY || (MSAA_QUALITY = {}));
var BUFFER_TYPE;
(function(BUFFER_TYPE2) {
  BUFFER_TYPE2[BUFFER_TYPE2["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
  BUFFER_TYPE2[BUFFER_TYPE2["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
  BUFFER_TYPE2[BUFFER_TYPE2["UNIFORM_BUFFER"] = 35345] = "UNIFORM_BUFFER";
})(BUFFER_TYPE || (BUFFER_TYPE = {}));
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var eventemitter3Exports = {};
var eventemitter3 = {
  get exports() {
    return eventemitter3Exports;
  },
  set exports(v2) {
    eventemitter3Exports = v2;
  }
};
(function(module) {
  var has = Object.prototype.hasOwnProperty, prefix = "~";
  function Events() {
  }
  if (Object.create) {
    Events.prototype = /* @__PURE__ */ Object.create(null);
    if (!new Events().__proto__)
      prefix = false;
  }
  function EE(fn, context2, once) {
    this.fn = fn;
    this.context = context2;
    this.once = once || false;
  }
  function addListener(emitter, event, fn, context2, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context2 || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt])
      emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
      emitter._events[evt].push(listener);
    else
      emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  }
  function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0)
      emitter._events = new Events();
    else
      delete emitter._events[evt];
  }
  function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
      return names;
    for (name in events = this._events) {
      if (has.call(events, name))
        names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers)
      return [];
    if (handlers.fn)
      return [handlers.fn];
    for (var i = 0, l2 = handlers.length, ee = new Array(l2); i < l2; i++) {
      ee[i] = handlers[i].fn;
    }
    return ee;
  };
  EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners)
      return 0;
    if (listeners.fn)
      return 1;
    return listeners.length;
  };
  EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
      if (listeners.once)
        this.removeListener(event, listeners.fn, void 0, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1); i < len; i++) {
        args[i - 1] = arguments[i];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j2;
      for (i = 0; i < length; i++) {
        if (listeners[i].once)
          this.removeListener(event, listeners[i].fn, void 0, true);
        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);
            break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);
            break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);
            break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
            break;
          default:
            if (!args)
              for (j2 = 1, args = new Array(len - 1); j2 < len; j2++) {
                args[j2 - 1] = arguments[j2];
              }
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter.prototype.on = function on(event, fn, context2) {
    return addListener(this, event, fn, context2, false);
  };
  EventEmitter.prototype.once = function once(event, fn, context2) {
    return addListener(this, event, fn, context2, true);
  };
  EventEmitter.prototype.removeListener = function removeListener(event, fn, context2, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context2 || listeners.context === context2)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events = [], length = listeners.length; i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context2 && listeners[i].context !== context2) {
          events.push(listeners[i]);
        }
      }
      if (events.length)
        this._events[evt] = events.length === 1 ? events[0] : events;
      else
        clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt])
        clearEvent(this, evt);
    } else {
      this._events = new Events();
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  EventEmitter.prefixed = prefix;
  EventEmitter.EventEmitter = EventEmitter;
  {
    module.exports = EventEmitter;
  }
})(eventemitter3);
const n = eventemitter3Exports;
var earcutExports = {};
var earcut$1 = {
  get exports() {
    return earcutExports;
  },
  set exports(v2) {
    earcutExports = v2;
  }
};
earcut$1.exports = earcut;
earcutExports.default = earcut;
function earcut(data, holeIndices, dim) {
  dim = dim || 2;
  var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
  if (!outerNode || outerNode.next === outerNode.prev)
    return triangles;
  var minX, minY, maxX, maxY, x2, y2, invSize;
  if (hasHoles)
    outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
  if (data.length > 80 * dim) {
    minX = maxX = data[0];
    minY = maxY = data[1];
    for (var i = dim; i < outerLen; i += dim) {
      x2 = data[i];
      y2 = data[i + 1];
      if (x2 < minX)
        minX = x2;
      if (y2 < minY)
        minY = y2;
      if (x2 > maxX)
        maxX = x2;
      if (y2 > maxY)
        maxY = y2;
    }
    invSize = Math.max(maxX - minX, maxY - minY);
    invSize = invSize !== 0 ? 32767 / invSize : 0;
  }
  earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
  return triangles;
}
function linkedList(data, start, end, dim, clockwise) {
  var i, last;
  if (clockwise === signedArea(data, start, end, dim) > 0) {
    for (i = start; i < end; i += dim)
      last = insertNode(i, data[i], data[i + 1], last);
  } else {
    for (i = end - dim; i >= start; i -= dim)
      last = insertNode(i, data[i], data[i + 1], last);
  }
  if (last && equals(last, last.next)) {
    removeNode(last);
    last = last.next;
  }
  return last;
}
function filterPoints(start, end) {
  if (!start)
    return start;
  if (!end)
    end = start;
  var p2 = start, again;
  do {
    again = false;
    if (!p2.steiner && (equals(p2, p2.next) || area(p2.prev, p2, p2.next) === 0)) {
      removeNode(p2);
      p2 = end = p2.prev;
      if (p2 === p2.next)
        break;
      again = true;
    } else {
      p2 = p2.next;
    }
  } while (again || p2 !== end);
  return end;
}
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
  if (!ear)
    return;
  if (!pass && invSize)
    indexCurve(ear, minX, minY, invSize);
  var stop = ear, prev, next;
  while (ear.prev !== ear.next) {
    prev = ear.prev;
    next = ear.next;
    if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
      triangles.push(prev.i / dim | 0);
      triangles.push(ear.i / dim | 0);
      triangles.push(next.i / dim | 0);
      removeNode(ear);
      ear = next.next;
      stop = next.next;
      continue;
    }
    ear = next;
    if (ear === stop) {
      if (!pass) {
        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
      } else if (pass === 1) {
        ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
        earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
      } else if (pass === 2) {
        splitEarcut(ear, triangles, dim, minX, minY, invSize);
      }
      break;
    }
  }
}
function isEar(ear) {
  var a2 = ear.prev, b2 = ear, c2 = ear.next;
  if (area(a2, b2, c2) >= 0)
    return false;
  var ax = a2.x, bx = b2.x, cx = c2.x, ay = a2.y, by = b2.y, cy = c2.y;
  var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
  var p2 = c2.next;
  while (p2 !== a2) {
    if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0)
      return false;
    p2 = p2.next;
  }
  return true;
}
function isEarHashed(ear, minX, minY, invSize) {
  var a2 = ear.prev, b2 = ear, c2 = ear.next;
  if (area(a2, b2, c2) >= 0)
    return false;
  var ax = a2.x, bx = b2.x, cx = c2.x, ay = a2.y, by = b2.y, cy = c2.y;
  var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
  var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
  var p2 = ear.prevZ, n2 = ear.nextZ;
  while (p2 && p2.z >= minZ && n2 && n2.z <= maxZ) {
    if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && p2 !== a2 && p2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0)
      return false;
    p2 = p2.prevZ;
    if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== a2 && n2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0)
      return false;
    n2 = n2.nextZ;
  }
  while (p2 && p2.z >= minZ) {
    if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && p2 !== a2 && p2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0)
      return false;
    p2 = p2.prevZ;
  }
  while (n2 && n2.z <= maxZ) {
    if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== a2 && n2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0)
      return false;
    n2 = n2.nextZ;
  }
  return true;
}
function cureLocalIntersections(start, triangles, dim) {
  var p2 = start;
  do {
    var a2 = p2.prev, b2 = p2.next.next;
    if (!equals(a2, b2) && intersects(a2, p2, p2.next, b2) && locallyInside(a2, b2) && locallyInside(b2, a2)) {
      triangles.push(a2.i / dim | 0);
      triangles.push(p2.i / dim | 0);
      triangles.push(b2.i / dim | 0);
      removeNode(p2);
      removeNode(p2.next);
      p2 = start = b2;
    }
    p2 = p2.next;
  } while (p2 !== start);
  return filterPoints(p2);
}
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
  var a2 = start;
  do {
    var b2 = a2.next.next;
    while (b2 !== a2.prev) {
      if (a2.i !== b2.i && isValidDiagonal(a2, b2)) {
        var c2 = splitPolygon(a2, b2);
        a2 = filterPoints(a2, a2.next);
        c2 = filterPoints(c2, c2.next);
        earcutLinked(a2, triangles, dim, minX, minY, invSize, 0);
        earcutLinked(c2, triangles, dim, minX, minY, invSize, 0);
        return;
      }
      b2 = b2.next;
    }
    a2 = a2.next;
  } while (a2 !== start);
}
function eliminateHoles(data, holeIndices, outerNode, dim) {
  var queue = [], i, len, start, end, list;
  for (i = 0, len = holeIndices.length; i < len; i++) {
    start = holeIndices[i] * dim;
    end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
    list = linkedList(data, start, end, dim, false);
    if (list === list.next)
      list.steiner = true;
    queue.push(getLeftmost(list));
  }
  queue.sort(compareX);
  for (i = 0; i < queue.length; i++) {
    outerNode = eliminateHole(queue[i], outerNode);
  }
  return outerNode;
}
function compareX(a2, b2) {
  return a2.x - b2.x;
}
function eliminateHole(hole, outerNode) {
  var bridge = findHoleBridge(hole, outerNode);
  if (!bridge) {
    return outerNode;
  }
  var bridgeReverse = splitPolygon(bridge, hole);
  filterPoints(bridgeReverse, bridgeReverse.next);
  return filterPoints(bridge, bridge.next);
}
function findHoleBridge(hole, outerNode) {
  var p2 = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m2;
  do {
    if (hy <= p2.y && hy >= p2.next.y && p2.next.y !== p2.y) {
      var x2 = p2.x + (hy - p2.y) * (p2.next.x - p2.x) / (p2.next.y - p2.y);
      if (x2 <= hx && x2 > qx) {
        qx = x2;
        m2 = p2.x < p2.next.x ? p2 : p2.next;
        if (x2 === hx)
          return m2;
      }
    }
    p2 = p2.next;
  } while (p2 !== outerNode);
  if (!m2)
    return null;
  var stop = m2, mx = m2.x, my = m2.y, tanMin = Infinity, tan;
  p2 = m2;
  do {
    if (hx >= p2.x && p2.x >= mx && hx !== p2.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p2.x, p2.y)) {
      tan = Math.abs(hy - p2.y) / (hx - p2.x);
      if (locallyInside(p2, hole) && (tan < tanMin || tan === tanMin && (p2.x > m2.x || p2.x === m2.x && sectorContainsSector(m2, p2)))) {
        m2 = p2;
        tanMin = tan;
      }
    }
    p2 = p2.next;
  } while (p2 !== stop);
  return m2;
}
function sectorContainsSector(m2, p2) {
  return area(m2.prev, m2, p2.prev) < 0 && area(p2.next, m2, m2.next) < 0;
}
function indexCurve(start, minX, minY, invSize) {
  var p2 = start;
  do {
    if (p2.z === 0)
      p2.z = zOrder(p2.x, p2.y, minX, minY, invSize);
    p2.prevZ = p2.prev;
    p2.nextZ = p2.next;
    p2 = p2.next;
  } while (p2 !== start);
  p2.prevZ.nextZ = null;
  p2.prevZ = null;
  sortLinked(p2);
}
function sortLinked(list) {
  var i, p2, q, e, tail, numMerges, pSize, qSize, inSize = 1;
  do {
    p2 = list;
    list = null;
    tail = null;
    numMerges = 0;
    while (p2) {
      numMerges++;
      q = p2;
      pSize = 0;
      for (i = 0; i < inSize; i++) {
        pSize++;
        q = q.nextZ;
        if (!q)
          break;
      }
      qSize = inSize;
      while (pSize > 0 || qSize > 0 && q) {
        if (pSize !== 0 && (qSize === 0 || !q || p2.z <= q.z)) {
          e = p2;
          p2 = p2.nextZ;
          pSize--;
        } else {
          e = q;
          q = q.nextZ;
          qSize--;
        }
        if (tail)
          tail.nextZ = e;
        else
          list = e;
        e.prevZ = tail;
        tail = e;
      }
      p2 = q;
    }
    tail.nextZ = null;
    inSize *= 2;
  } while (numMerges > 1);
  return list;
}
function zOrder(x2, y2, minX, minY, invSize) {
  x2 = (x2 - minX) * invSize | 0;
  y2 = (y2 - minY) * invSize | 0;
  x2 = (x2 | x2 << 8) & 16711935;
  x2 = (x2 | x2 << 4) & 252645135;
  x2 = (x2 | x2 << 2) & 858993459;
  x2 = (x2 | x2 << 1) & 1431655765;
  y2 = (y2 | y2 << 8) & 16711935;
  y2 = (y2 | y2 << 4) & 252645135;
  y2 = (y2 | y2 << 2) & 858993459;
  y2 = (y2 | y2 << 1) & 1431655765;
  return x2 | y2 << 1;
}
function getLeftmost(start) {
  var p2 = start, leftmost = start;
  do {
    if (p2.x < leftmost.x || p2.x === leftmost.x && p2.y < leftmost.y)
      leftmost = p2;
    p2 = p2.next;
  } while (p2 !== start);
  return leftmost;
}
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
  return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
}
function isValidDiagonal(a2, b2) {
  return a2.next.i !== b2.i && a2.prev.i !== b2.i && !intersectsPolygon(a2, b2) && (locallyInside(a2, b2) && locallyInside(b2, a2) && middleInside(a2, b2) && (area(a2.prev, a2, b2.prev) || area(a2, b2.prev, b2)) || equals(a2, b2) && area(a2.prev, a2, a2.next) > 0 && area(b2.prev, b2, b2.next) > 0);
}
function area(p2, q, r2) {
  return (q.y - p2.y) * (r2.x - q.x) - (q.x - p2.x) * (r2.y - q.y);
}
function equals(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}
function intersects(p1, q1, p2, q2) {
  var o1 = sign(area(p1, q1, p2));
  var o2 = sign(area(p1, q1, q2));
  var o3 = sign(area(p2, q2, p1));
  var o4 = sign(area(p2, q2, q1));
  if (o1 !== o2 && o3 !== o4)
    return true;
  if (o1 === 0 && onSegment(p1, p2, q1))
    return true;
  if (o2 === 0 && onSegment(p1, q2, q1))
    return true;
  if (o3 === 0 && onSegment(p2, p1, q2))
    return true;
  if (o4 === 0 && onSegment(p2, q1, q2))
    return true;
  return false;
}
function onSegment(p2, q, r2) {
  return q.x <= Math.max(p2.x, r2.x) && q.x >= Math.min(p2.x, r2.x) && q.y <= Math.max(p2.y, r2.y) && q.y >= Math.min(p2.y, r2.y);
}
function sign(num) {
  return num > 0 ? 1 : num < 0 ? -1 : 0;
}
function intersectsPolygon(a2, b2) {
  var p2 = a2;
  do {
    if (p2.i !== a2.i && p2.next.i !== a2.i && p2.i !== b2.i && p2.next.i !== b2.i && intersects(p2, p2.next, a2, b2))
      return true;
    p2 = p2.next;
  } while (p2 !== a2);
  return false;
}
function locallyInside(a2, b2) {
  return area(a2.prev, a2, a2.next) < 0 ? area(a2, b2, a2.next) >= 0 && area(a2, a2.prev, b2) >= 0 : area(a2, b2, a2.prev) < 0 || area(a2, a2.next, b2) < 0;
}
function middleInside(a2, b2) {
  var p2 = a2, inside = false, px = (a2.x + b2.x) / 2, py = (a2.y + b2.y) / 2;
  do {
    if (p2.y > py !== p2.next.y > py && p2.next.y !== p2.y && px < (p2.next.x - p2.x) * (py - p2.y) / (p2.next.y - p2.y) + p2.x)
      inside = !inside;
    p2 = p2.next;
  } while (p2 !== a2);
  return inside;
}
function splitPolygon(a2, b2) {
  var a22 = new Node(a2.i, a2.x, a2.y), b22 = new Node(b2.i, b2.x, b2.y), an = a2.next, bp = b2.prev;
  a2.next = b2;
  b2.prev = a2;
  a22.next = an;
  an.prev = a22;
  b22.next = a22;
  a22.prev = b22;
  bp.next = b22;
  b22.prev = bp;
  return b22;
}
function insertNode(i, x2, y2, last) {
  var p2 = new Node(i, x2, y2);
  if (!last) {
    p2.prev = p2;
    p2.next = p2;
  } else {
    p2.next = last.next;
    p2.prev = last;
    last.next.prev = p2;
    last.next = p2;
  }
  return p2;
}
function removeNode(p2) {
  p2.next.prev = p2.prev;
  p2.prev.next = p2.next;
  if (p2.prevZ)
    p2.prevZ.nextZ = p2.nextZ;
  if (p2.nextZ)
    p2.nextZ.prevZ = p2.prevZ;
}
function Node(i, x2, y2) {
  this.i = i;
  this.x = x2;
  this.y = y2;
  this.prev = null;
  this.next = null;
  this.z = 0;
  this.prevZ = null;
  this.nextZ = null;
  this.steiner = false;
}
earcut.deviation = function(data, holeIndices, dim, triangles) {
  var hasHoles = holeIndices && holeIndices.length;
  var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
  var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
  if (hasHoles) {
    for (var i = 0, len = holeIndices.length; i < len; i++) {
      var start = holeIndices[i] * dim;
      var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      polygonArea -= Math.abs(signedArea(data, start, end, dim));
    }
  }
  var trianglesArea = 0;
  for (i = 0; i < triangles.length; i += 3) {
    var a2 = triangles[i] * dim;
    var b2 = triangles[i + 1] * dim;
    var c2 = triangles[i + 2] * dim;
    trianglesArea += Math.abs(
      (data[a2] - data[c2]) * (data[b2 + 1] - data[a2 + 1]) - (data[a2] - data[b2]) * (data[c2 + 1] - data[a2 + 1])
    );
  }
  return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
};
function signedArea(data, start, end, dim) {
  var sum = 0;
  for (var i = start, j2 = end - dim; i < end; i += dim) {
    sum += (data[j2] - data[i]) * (data[i + 1] + data[j2 + 1]);
    j2 = i;
  }
  return sum;
}
earcut.flatten = function(data) {
  var dim = data[0][0].length, result = { vertices: [], holes: [], dimensions: dim }, holeIndex = 0;
  for (var i = 0; i < data.length; i++) {
    for (var j2 = 0; j2 < data[i].length; j2++) {
      for (var d2 = 0; d2 < dim; d2++)
        result.vertices.push(data[i][j2][d2]);
    }
    if (i > 0) {
      holeIndex += data[i - 1].length;
      result.holes.push(holeIndex);
    }
  }
  return result;
};
var punycodeExports = {};
var punycode$1 = {
  get exports() {
    return punycodeExports;
  },
  set exports(v2) {
    punycodeExports = v2;
  }
};
/*! https://mths.be/punycode v1.3.2 by @mathias */
(function(module, exports) {
  (function(root) {
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = module && !module.nodeType && module;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
      root = freeGlobal;
    }
    var punycode2, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
      "overflow": "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
    function error(type) {
      throw RangeError(errors[type]);
    }
    function map2(array, fn) {
      var length = array.length;
      var result = [];
      while (length--) {
        result[length] = fn(array[length]);
      }
      return result;
    }
    function mapDomain(string, fn) {
      var parts = string.split("@");
      var result = "";
      if (parts.length > 1) {
        result = parts[0] + "@";
        string = parts[1];
      }
      string = string.replace(regexSeparators, ".");
      var labels = string.split(".");
      var encoded = map2(labels, fn).join(".");
      return result + encoded;
    }
    function ucs2decode(string) {
      var output = [], counter = 0, length = string.length, value, extra;
      while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 55296 && value <= 56319 && counter < length) {
          extra = string.charCodeAt(counter++);
          if ((extra & 64512) == 56320) {
            output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
          } else {
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }
      return output;
    }
    function ucs2encode(array) {
      return map2(array, function(value) {
        var output = "";
        if (value > 65535) {
          value -= 65536;
          output += stringFromCharCode(value >>> 10 & 1023 | 55296);
          value = 56320 | value & 1023;
        }
        output += stringFromCharCode(value);
        return output;
      }).join("");
    }
    function basicToDigit(codePoint) {
      if (codePoint - 48 < 10) {
        return codePoint - 22;
      }
      if (codePoint - 65 < 26) {
        return codePoint - 65;
      }
      if (codePoint - 97 < 26) {
        return codePoint - 97;
      }
      return base;
    }
    function digitToBasic(digit, flag) {
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    }
    function adapt(delta, numPoints, firstTime) {
      var k = 0;
      delta = firstTime ? floor(delta / damp) : delta >> 1;
      delta += floor(delta / numPoints);
      for (; delta > baseMinusTMin * tMax >> 1; k += base) {
        delta = floor(delta / baseMinusTMin);
      }
      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    }
    function decode2(input) {
      var output = [], inputLength = input.length, out, i = 0, n2 = initialN, bias = initialBias, basic, j2, index, oldi, w2, k, digit, t, baseMinusT;
      basic = input.lastIndexOf(delimiter);
      if (basic < 0) {
        basic = 0;
      }
      for (j2 = 0; j2 < basic; ++j2) {
        if (input.charCodeAt(j2) >= 128) {
          error("not-basic");
        }
        output.push(input.charCodeAt(j2));
      }
      for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
        for (oldi = i, w2 = 1, k = base; ; k += base) {
          if (index >= inputLength) {
            error("invalid-input");
          }
          digit = basicToDigit(input.charCodeAt(index++));
          if (digit >= base || digit > floor((maxInt - i) / w2)) {
            error("overflow");
          }
          i += digit * w2;
          t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (digit < t) {
            break;
          }
          baseMinusT = base - t;
          if (w2 > floor(maxInt / baseMinusT)) {
            error("overflow");
          }
          w2 *= baseMinusT;
        }
        out = output.length + 1;
        bias = adapt(i - oldi, out, oldi == 0);
        if (floor(i / out) > maxInt - n2) {
          error("overflow");
        }
        n2 += floor(i / out);
        i %= out;
        output.splice(i++, 0, n2);
      }
      return ucs2encode(output);
    }
    function encode2(input) {
      var n2, delta, handledCPCount, basicLength, bias, j2, m2, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
      input = ucs2decode(input);
      inputLength = input.length;
      n2 = initialN;
      delta = 0;
      bias = initialBias;
      for (j2 = 0; j2 < inputLength; ++j2) {
        currentValue = input[j2];
        if (currentValue < 128) {
          output.push(stringFromCharCode(currentValue));
        }
      }
      handledCPCount = basicLength = output.length;
      if (basicLength) {
        output.push(delimiter);
      }
      while (handledCPCount < inputLength) {
        for (m2 = maxInt, j2 = 0; j2 < inputLength; ++j2) {
          currentValue = input[j2];
          if (currentValue >= n2 && currentValue < m2) {
            m2 = currentValue;
          }
        }
        handledCPCountPlusOne = handledCPCount + 1;
        if (m2 - n2 > floor((maxInt - delta) / handledCPCountPlusOne)) {
          error("overflow");
        }
        delta += (m2 - n2) * handledCPCountPlusOne;
        n2 = m2;
        for (j2 = 0; j2 < inputLength; ++j2) {
          currentValue = input[j2];
          if (currentValue < n2 && ++delta > maxInt) {
            error("overflow");
          }
          if (currentValue == n2) {
            for (q = delta, k = base; ; k += base) {
              t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
              if (q < t) {
                break;
              }
              qMinusT = q - t;
              baseMinusT = base - t;
              output.push(
                stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
              );
              q = floor(qMinusT / baseMinusT);
            }
            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
            delta = 0;
            ++handledCPCount;
          }
        }
        ++delta;
        ++n2;
      }
      return output.join("");
    }
    function toUnicode(input) {
      return mapDomain(input, function(string) {
        return regexPunycode.test(string) ? decode2(string.slice(4).toLowerCase()) : string;
      });
    }
    function toASCII(input) {
      return mapDomain(input, function(string) {
        return regexNonASCII.test(string) ? "xn--" + encode2(string) : string;
      });
    }
    punycode2 = {
      "version": "1.3.2",
      "ucs2": {
        "decode": ucs2decode,
        "encode": ucs2encode
      },
      "decode": decode2,
      "encode": encode2,
      "toASCII": toASCII,
      "toUnicode": toUnicode
    };
    if (freeExports && freeModule) {
      if (module.exports == freeExports) {
        freeModule.exports = punycode2;
      } else {
        for (key in punycode2) {
          punycode2.hasOwnProperty(key) && (freeExports[key] = punycode2[key]);
        }
      }
    } else {
      root.punycode = punycode2;
    }
  })(commonjsGlobal);
})(punycode$1, punycodeExports);
var util$1 = {
  isString: function(arg) {
    return typeof arg === "string";
  },
  isObject: function(arg) {
    return typeof arg === "object" && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};
var querystring$1 = {};
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var decode = function(qs, sep, eq, options) {
  sep = sep || "&";
  eq = eq || "=";
  var obj = {};
  if (typeof qs !== "string" || qs.length === 0) {
    return obj;
  }
  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1e3;
  if (options && typeof options.maxKeys === "number") {
    maxKeys = options.maxKeys;
  }
  var len = qs.length;
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }
  for (var i = 0; i < len; ++i) {
    var x2 = qs[i].replace(regexp, "%20"), idx = x2.indexOf(eq), kstr, vstr, k, v2;
    if (idx >= 0) {
      kstr = x2.substr(0, idx);
      vstr = x2.substr(idx + 1);
    } else {
      kstr = x2;
      vstr = "";
    }
    k = decodeURIComponent(kstr);
    v2 = decodeURIComponent(vstr);
    if (!hasOwnProperty(obj, k)) {
      obj[k] = v2;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v2);
    } else {
      obj[k] = [obj[k], v2];
    }
  }
  return obj;
};
var stringifyPrimitive = function(v2) {
  switch (typeof v2) {
    case "string":
      return v2;
    case "boolean":
      return v2 ? "true" : "false";
    case "number":
      return isFinite(v2) ? v2 : "";
    default:
      return "";
  }
};
var encode = function(obj, sep, eq, name) {
  sep = sep || "&";
  eq = eq || "=";
  if (obj === null) {
    obj = void 0;
  }
  if (typeof obj === "object") {
    return Object.keys(obj).map(function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function(v2) {
          return ks + encodeURIComponent(stringifyPrimitive(v2));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }
  if (!name)
    return "";
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};
querystring$1.decode = querystring$1.parse = decode;
querystring$1.encode = querystring$1.stringify = encode;
var punycode = punycodeExports;
var util = util$1;
var parse = urlParse;
var resolve = urlResolve;
var format = urlFormat;
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}
var protocolPattern = /^([a-z0-9.+-]+:)/i, portPattern = /:[0-9]*$/, simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"], unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims), autoEscape = ["'"].concat(unwise), nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape), hostEndingChars = ["/", "?", "#"], hostnameMaxLen = 255, hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/, hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, unsafeProtocol = {
  "javascript": true,
  "javascript:": true
}, hostlessProtocol = {
  "javascript": true,
  "javascript:": true
}, slashedProtocol = {
  "http": true,
  "https": true,
  "ftp": true,
  "gopher": true,
  "file": true,
  "http:": true,
  "https:": true,
  "ftp:": true,
  "gopher:": true,
  "file:": true
}, querystring = querystring$1;
function urlParse(url2, parseQueryString, slashesDenoteHost) {
  if (url2 && util.isObject(url2) && url2 instanceof Url)
    return url2;
  var u2 = new Url();
  u2.parse(url2, parseQueryString, slashesDenoteHost);
  return u2;
}
Url.prototype.parse = function(url2, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url2)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url2);
  }
  var queryIndex = url2.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url2.indexOf("#") ? "?" : "#", uSplit = url2.split(splitter), slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, "/");
  url2 = uSplit.join(splitter);
  var rest = url2;
  rest = rest.trim();
  if (!slashesDenoteHost && url2.split("#").length === 1) {
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = "";
        this.query = {};
      }
      return this;
    }
  }
  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === "//";
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    var auth, atSign;
    if (hostEnd === -1) {
      atSign = rest.lastIndexOf("@");
    } else {
      atSign = rest.lastIndexOf("@", hostEnd);
    }
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    if (hostEnd === -1)
      hostEnd = rest.length;
    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);
    this.parseHost();
    this.hostname = this.hostname || "";
    var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l2 = hostparts.length; i < l2; i++) {
        var part = hostparts[i];
        if (!part)
          continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = "";
          for (var j2 = 0, k = part.length; j2 < k; j2++) {
            if (part.charCodeAt(j2) > 127) {
              newpart += "x";
            } else {
              newpart += part[j2];
            }
          }
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = "/" + notHost.join(".") + rest;
            }
            this.hostname = validParts.join(".");
            break;
          }
        }
      }
    }
    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = "";
    } else {
      this.hostname = this.hostname.toLowerCase();
    }
    if (!ipv6Hostname) {
      this.hostname = punycode.toASCII(this.hostname);
    }
    var p2 = this.port ? ":" + this.port : "";
    var h2 = this.hostname || "";
    this.host = h2 + p2;
    this.href += this.host;
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== "/") {
        rest = "/" + rest;
      }
    }
  }
  if (!unsafeProtocol[lowerProto]) {
    for (var i = 0, l2 = autoEscape.length; i < l2; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }
  var hash = rest.indexOf("#");
  if (hash !== -1) {
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf("?");
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    this.search = "";
    this.query = {};
  }
  if (rest)
    this.pathname = rest;
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = "/";
  }
  if (this.pathname || this.search) {
    var p2 = this.pathname || "";
    var s2 = this.search || "";
    this.path = p2 + s2;
  }
  this.href = this.format();
  return this;
};
function urlFormat(obj) {
  if (util.isString(obj))
    obj = urlParse(obj);
  if (!(obj instanceof Url))
    return Url.prototype.format.call(obj);
  return obj.format();
}
Url.prototype.format = function() {
  var auth = this.auth || "";
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ":");
    auth += "@";
  }
  var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
    if (this.port) {
      host += ":" + this.port;
    }
  }
  if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }
  var search = this.search || query && "?" + query || "";
  if (protocol && protocol.substr(-1) !== ":")
    protocol += ":";
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = "//" + (host || "");
    if (pathname && pathname.charAt(0) !== "/")
      pathname = "/" + pathname;
  } else if (!host) {
    host = "";
  }
  if (hash && hash.charAt(0) !== "#")
    hash = "#" + hash;
  if (search && search.charAt(0) !== "?")
    search = "?" + search;
  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace("#", "%23");
  return protocol + host + pathname + search + hash;
};
function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}
Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};
Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }
  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }
  result.hash = relative.hash;
  if (relative.href === "") {
    result.href = result.format();
    return result;
  }
  if (relative.slashes && !relative.protocol) {
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== "protocol")
        result[rkey] = relative[rkey];
    }
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = "/";
    }
    result.href = result.format();
    return result;
  }
  if (relative.protocol && relative.protocol !== result.protocol) {
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v2 = 0; v2 < keys.length; v2++) {
        var k = keys[v2];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }
    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || "").split("/");
      while (relPath.length && !(relative.host = relPath.shift()))
        ;
      if (!relative.host)
        relative.host = "";
      if (!relative.hostname)
        relative.hostname = "";
      if (relPath[0] !== "")
        relPath.unshift("");
      if (relPath.length < 2)
        relPath.unshift("");
      result.pathname = relPath.join("/");
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || "";
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    if (result.pathname || result.search) {
      var p2 = result.pathname || "";
      var s2 = result.search || "";
      result.path = p2 + s2;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }
  var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
  if (psychotic) {
    result.hostname = "";
    result.port = null;
    if (result.host) {
      if (srcPath[0] === "")
        srcPath[0] = result.host;
      else
        srcPath.unshift(result.host);
    }
    result.host = "";
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === "")
          relPath[0] = relative.host;
        else
          relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
  }
  if (isRelAbs) {
    result.host = relative.host || relative.host === "" ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
  } else if (relPath.length) {
    if (!srcPath)
      srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
    }
    result.href = result.format();
    return result;
  }
  if (!srcPath.length) {
    result.pathname = null;
    if (result.search) {
      result.path = "/" + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === ".") {
      srcPath.splice(i, 1);
    } else if (last === "..") {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift("..");
    }
  }
  if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
    srcPath.unshift("");
  }
  if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
    srcPath.push("");
  }
  var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
    var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }
  mustEndAbs = mustEndAbs || result.host && srcPath.length;
  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift("");
  }
  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join("/");
  }
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};
Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ":") {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host)
    this.hostname = host;
};
/*!
 * @pixi/utils - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/utils is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var url = {
  parse,
  format,
  resolve
};
settings.RETINA_PREFIX = /@([0-9\.]+)x/;
settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
var saidHello = false;
var VERSION = "6.5.2";
function sayHello(type) {
  var _a;
  if (saidHello) {
    return;
  }
  if (settings.ADAPTER.getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
    var args = [
      "\n %c %c %c PixiJS " + VERSION + " - ✰ " + type + " ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n",
      "background: #ff66a5; padding:5px 0;",
      "background: #ff66a5; padding:5px 0;",
      "color: #ff66a5; background: #030307; padding:5px 0;",
      "background: #ff66a5; padding:5px 0;",
      "background: #ffc3dc; padding:5px 0;",
      "background: #ff66a5; padding:5px 0;",
      "color: #ff2424; background: #fff; padding:5px 0;",
      "color: #ff2424; background: #fff; padding:5px 0;",
      "color: #ff2424; background: #fff; padding:5px 0;"
    ];
    (_a = globalThis.console).log.apply(_a, args);
  } else if (globalThis.console) {
    globalThis.console.log("PixiJS " + VERSION + " - " + type + " - http://www.pixijs.com/");
  }
  saidHello = true;
}
var supported;
function isWebGLSupported() {
  if (typeof supported === "undefined") {
    supported = function supported2() {
      var contextOptions = {
        stencil: true,
        failIfMajorPerformanceCaveat: settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
      };
      try {
        if (!settings.ADAPTER.getWebGLRenderingContext()) {
          return false;
        }
        var canvas = settings.ADAPTER.createCanvas();
        var gl = canvas.getContext("webgl", contextOptions) || canvas.getContext("experimental-webgl", contextOptions);
        var success = !!(gl && gl.getContextAttributes().stencil);
        if (gl) {
          var loseContext = gl.getExtension("WEBGL_lose_context");
          if (loseContext) {
            loseContext.loseContext();
          }
        }
        gl = null;
        return success;
      } catch (e) {
        return false;
      }
    }();
  }
  return supported;
}
function hex2rgb(hex, out) {
  if (out === void 0) {
    out = [];
  }
  out[0] = (hex >> 16 & 255) / 255;
  out[1] = (hex >> 8 & 255) / 255;
  out[2] = (hex & 255) / 255;
  return out;
}
function hex2string(hex) {
  var hexString = hex.toString(16);
  hexString = "000000".substring(0, 6 - hexString.length) + hexString;
  return "#" + hexString;
}
function mapPremultipliedBlendModes() {
  var pm = [];
  var npm = [];
  for (var i = 0; i < 32; i++) {
    pm[i] = i;
    npm[i] = i;
  }
  pm[BLEND_MODES.NORMAL_NPM] = BLEND_MODES.NORMAL;
  pm[BLEND_MODES.ADD_NPM] = BLEND_MODES.ADD;
  pm[BLEND_MODES.SCREEN_NPM] = BLEND_MODES.SCREEN;
  npm[BLEND_MODES.NORMAL] = BLEND_MODES.NORMAL_NPM;
  npm[BLEND_MODES.ADD] = BLEND_MODES.ADD_NPM;
  npm[BLEND_MODES.SCREEN] = BLEND_MODES.SCREEN_NPM;
  var array = [];
  array.push(npm);
  array.push(pm);
  return array;
}
var premultiplyBlendMode = mapPremultipliedBlendModes();
function premultiplyTint(tint, alpha) {
  if (alpha === 1) {
    return (alpha * 255 << 24) + tint;
  }
  if (alpha === 0) {
    return 0;
  }
  var R = tint >> 16 & 255;
  var G = tint >> 8 & 255;
  var B = tint & 255;
  R = R * alpha + 0.5 | 0;
  G = G * alpha + 0.5 | 0;
  B = B * alpha + 0.5 | 0;
  return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
}
function getBufferType(array) {
  if (array.BYTES_PER_ELEMENT === 4) {
    if (array instanceof Float32Array) {
      return "Float32Array";
    } else if (array instanceof Uint32Array) {
      return "Uint32Array";
    }
    return "Int32Array";
  } else if (array.BYTES_PER_ELEMENT === 2) {
    if (array instanceof Uint16Array) {
      return "Uint16Array";
    }
  } else if (array.BYTES_PER_ELEMENT === 1) {
    if (array instanceof Uint8Array) {
      return "Uint8Array";
    }
  }
  return null;
}
function nextPow2(v2) {
  v2 += v2 === 0 ? 1 : 0;
  --v2;
  v2 |= v2 >>> 1;
  v2 |= v2 >>> 2;
  v2 |= v2 >>> 4;
  v2 |= v2 >>> 8;
  v2 |= v2 >>> 16;
  return v2 + 1;
}
function isPow2(v2) {
  return !(v2 & v2 - 1) && !!v2;
}
function log2(v2) {
  var r2 = (v2 > 65535 ? 1 : 0) << 4;
  v2 >>>= r2;
  var shift = (v2 > 255 ? 1 : 0) << 3;
  v2 >>>= shift;
  r2 |= shift;
  shift = (v2 > 15 ? 1 : 0) << 2;
  v2 >>>= shift;
  r2 |= shift;
  shift = (v2 > 3 ? 1 : 0) << 1;
  v2 >>>= shift;
  r2 |= shift;
  return r2 | v2 >> 1;
}
function removeItems(arr, startIdx, removeCount) {
  var length = arr.length;
  var i;
  if (startIdx >= length || removeCount === 0) {
    return;
  }
  removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;
  var len = length - removeCount;
  for (i = startIdx; i < len; ++i) {
    arr[i] = arr[i + removeCount];
  }
  arr.length = len;
}
var nextUid = 0;
function uid() {
  return ++nextUid;
}
var warnings = {};
function deprecation(version, message, ignoreDepth) {
  if (ignoreDepth === void 0) {
    ignoreDepth = 3;
  }
  if (warnings[message]) {
    return;
  }
  var stack = new Error().stack;
  if (typeof stack === "undefined") {
    console.warn("PixiJS Deprecation Warning: ", message + "\nDeprecated since v" + version);
  } else {
    stack = stack.split("\n").splice(ignoreDepth).join("\n");
    if (console.groupCollapsed) {
      console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", message + "\nDeprecated since v" + version);
      console.warn(stack);
      console.groupEnd();
    } else {
      console.warn("PixiJS Deprecation Warning: ", message + "\nDeprecated since v" + version);
      console.warn(stack);
    }
  }
  warnings[message] = true;
}
var ProgramCache = {};
var TextureCache = /* @__PURE__ */ Object.create(null);
var BaseTextureCache = /* @__PURE__ */ Object.create(null);
(function() {
  function CanvasRenderTarget(width, height, resolution) {
    this.canvas = settings.ADAPTER.createCanvas();
    this.context = this.canvas.getContext("2d");
    this.resolution = resolution || settings.RESOLUTION;
    this.resize(width, height);
  }
  CanvasRenderTarget.prototype.clear = function() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  CanvasRenderTarget.prototype.resize = function(desiredWidth, desiredHeight) {
    this.canvas.width = Math.round(desiredWidth * this.resolution);
    this.canvas.height = Math.round(desiredHeight * this.resolution);
  };
  CanvasRenderTarget.prototype.destroy = function() {
    this.context = null;
    this.canvas = null;
  };
  Object.defineProperty(CanvasRenderTarget.prototype, "width", {
    get: function() {
      return this.canvas.width;
    },
    set: function(val) {
      this.canvas.width = Math.round(val);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(CanvasRenderTarget.prototype, "height", {
    get: function() {
      return this.canvas.height;
    },
    set: function(val) {
      this.canvas.height = Math.round(val);
    },
    enumerable: false,
    configurable: true
  });
  return CanvasRenderTarget;
})();
var tempAnchor$1;
function determineCrossOrigin(url$1, loc) {
  if (loc === void 0) {
    loc = globalThis.location;
  }
  if (url$1.indexOf("data:") === 0) {
    return "";
  }
  loc = loc || globalThis.location;
  if (!tempAnchor$1) {
    tempAnchor$1 = document.createElement("a");
  }
  tempAnchor$1.href = url$1;
  var parsedUrl = url.parse(tempAnchor$1.href);
  var samePort = !parsedUrl.port && loc.port === "" || parsedUrl.port === loc.port;
  if (parsedUrl.hostname !== loc.hostname || !samePort || parsedUrl.protocol !== loc.protocol) {
    return "anonymous";
  }
  return "";
}
function getResolutionOfUrl(url2, defaultValue2) {
  var resolution = settings.RETINA_PREFIX.exec(url2);
  if (resolution) {
    return parseFloat(resolution[1]);
  }
  return defaultValue2 !== void 0 ? defaultValue2 : 1;
}
/*!
 * @pixi/extensions - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/extensions is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign$1 = function() {
  __assign$1 = Object.assign || function __assign2(t) {
    var arguments$1 = arguments;
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments$1[i];
      for (var p2 in s2) {
        if (Object.prototype.hasOwnProperty.call(s2, p2)) {
          t[p2] = s2[p2];
        }
      }
    }
    return t;
  };
  return __assign$1.apply(this, arguments);
};
var ExtensionType;
(function(ExtensionType2) {
  ExtensionType2["Application"] = "application";
  ExtensionType2["RendererPlugin"] = "renderer-webgl-plugin";
  ExtensionType2["CanvasRendererPlugin"] = "renderer-canvas-plugin";
  ExtensionType2["Loader"] = "loader";
  ExtensionType2["LoadParser"] = "load-parser";
  ExtensionType2["ResolveParser"] = "resolve-parser";
  ExtensionType2["CacheParser"] = "cache-parser";
  ExtensionType2["DetectionParser"] = "detection-parser";
})(ExtensionType || (ExtensionType = {}));
var normalizeExtension = function(ext) {
  if (typeof ext === "function" || typeof ext === "object" && ext.extension) {
    if (!ext.extension) {
      throw new Error("Extension class must have an extension object");
    }
    var metadata = typeof ext.extension !== "object" ? { type: ext.extension } : ext.extension;
    ext = __assign$1(__assign$1({}, metadata), { ref: ext });
  }
  if (typeof ext === "object") {
    ext = __assign$1({}, ext);
  } else {
    throw new Error("Invalid extension type");
  }
  if (typeof ext.type === "string") {
    ext.type = [ext.type];
  }
  return ext;
};
var extensions = {
  _addHandlers: null,
  _removeHandlers: null,
  _queue: {},
  remove: function() {
    var arguments$1 = arguments;
    var _this = this;
    var extensions2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      extensions2[_i] = arguments$1[_i];
    }
    extensions2.map(normalizeExtension).forEach(function(ext) {
      ext.type.forEach(function(type) {
        var _a, _b;
        return (_b = (_a = _this._removeHandlers)[type]) === null || _b === void 0 ? void 0 : _b.call(_a, ext);
      });
    });
    return this;
  },
  add: function() {
    var arguments$1 = arguments;
    var _this = this;
    var extensions2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      extensions2[_i] = arguments$1[_i];
    }
    extensions2.map(normalizeExtension).forEach(function(ext) {
      ext.type.forEach(function(type) {
        var handlers = _this._addHandlers;
        var queue = _this._queue;
        if (!handlers[type]) {
          queue[type] = queue[type] || [];
          queue[type].push(ext);
        } else {
          handlers[type](ext);
        }
      });
    });
    return this;
  },
  handle: function(type, onAdd, onRemove) {
    var addHandlers = this._addHandlers = this._addHandlers || {};
    var removeHandlers = this._removeHandlers = this._removeHandlers || {};
    if (addHandlers[type] || removeHandlers[type]) {
      throw new Error("Extension type " + type + " already has a handler");
    }
    addHandlers[type] = onAdd;
    removeHandlers[type] = onRemove;
    var queue = this._queue;
    if (queue[type]) {
      queue[type].forEach(function(ext) {
        return onAdd(ext);
      });
      delete queue[type];
    }
    return this;
  },
  handleByMap: function(type, map2) {
    return this.handle(type, function(extension) {
      map2[extension.name] = extension.ref;
    }, function(extension) {
      delete map2[extension.name];
    });
  },
  handleByList: function(type, list) {
    return this.handle(type, function(extension) {
      var _a, _b;
      list.push(extension.ref);
      if (type === ExtensionType.Loader) {
        (_b = (_a = extension.ref).add) === null || _b === void 0 ? void 0 : _b.call(_a);
      }
    }, function(extension) {
      var index = list.indexOf(extension.ref);
      if (index !== -1) {
        list.splice(index, 1);
      }
    });
  }
};
/*!
 * @pixi/runner - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/runner is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Runner = function() {
  function Runner2(name) {
    this.items = [];
    this._name = name;
    this._aliasCount = 0;
  }
  Runner2.prototype.emit = function(a0, a1, a2, a3, a4, a5, a6, a7) {
    if (arguments.length > 8) {
      throw new Error("max arguments reached");
    }
    var _a = this, name = _a.name, items = _a.items;
    this._aliasCount++;
    for (var i = 0, len = items.length; i < len; i++) {
      items[i][name](a0, a1, a2, a3, a4, a5, a6, a7);
    }
    if (items === this.items) {
      this._aliasCount--;
    }
    return this;
  };
  Runner2.prototype.ensureNonAliasedItems = function() {
    if (this._aliasCount > 0 && this.items.length > 1) {
      this._aliasCount = 0;
      this.items = this.items.slice(0);
    }
  };
  Runner2.prototype.add = function(item) {
    if (item[this._name]) {
      this.ensureNonAliasedItems();
      this.remove(item);
      this.items.push(item);
    }
    return this;
  };
  Runner2.prototype.remove = function(item) {
    var index = this.items.indexOf(item);
    if (index !== -1) {
      this.ensureNonAliasedItems();
      this.items.splice(index, 1);
    }
    return this;
  };
  Runner2.prototype.contains = function(item) {
    return this.items.indexOf(item) !== -1;
  };
  Runner2.prototype.removeAll = function() {
    this.ensureNonAliasedItems();
    this.items.length = 0;
    return this;
  };
  Runner2.prototype.destroy = function() {
    this.removeAll();
    this.items = null;
    this._name = null;
  };
  Object.defineProperty(Runner2.prototype, "empty", {
    get: function() {
      return this.items.length === 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Runner2.prototype, "name", {
    get: function() {
      return this._name;
    },
    enumerable: false,
    configurable: true
  });
  return Runner2;
}();
Object.defineProperties(Runner.prototype, {
  dispatch: { value: Runner.prototype.emit },
  run: { value: Runner.prototype.emit }
});
/*!
 * @pixi/ticker - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/ticker is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
settings.TARGET_FPMS = 0.06;
var UPDATE_PRIORITY;
(function(UPDATE_PRIORITY2) {
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["INTERACTION"] = 50] = "INTERACTION";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["HIGH"] = 25] = "HIGH";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["NORMAL"] = 0] = "NORMAL";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["LOW"] = -25] = "LOW";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["UTILITY"] = -50] = "UTILITY";
})(UPDATE_PRIORITY || (UPDATE_PRIORITY = {}));
var TickerListener = function() {
  function TickerListener2(fn, context2, priority, once) {
    if (context2 === void 0) {
      context2 = null;
    }
    if (priority === void 0) {
      priority = 0;
    }
    if (once === void 0) {
      once = false;
    }
    this.next = null;
    this.previous = null;
    this._destroyed = false;
    this.fn = fn;
    this.context = context2;
    this.priority = priority;
    this.once = once;
  }
  TickerListener2.prototype.match = function(fn, context2) {
    if (context2 === void 0) {
      context2 = null;
    }
    return this.fn === fn && this.context === context2;
  };
  TickerListener2.prototype.emit = function(deltaTime) {
    if (this.fn) {
      if (this.context) {
        this.fn.call(this.context, deltaTime);
      } else {
        this.fn(deltaTime);
      }
    }
    var redirect = this.next;
    if (this.once) {
      this.destroy(true);
    }
    if (this._destroyed) {
      this.next = null;
    }
    return redirect;
  };
  TickerListener2.prototype.connect = function(previous) {
    this.previous = previous;
    if (previous.next) {
      previous.next.previous = this;
    }
    this.next = previous.next;
    previous.next = this;
  };
  TickerListener2.prototype.destroy = function(hard) {
    if (hard === void 0) {
      hard = false;
    }
    this._destroyed = true;
    this.fn = null;
    this.context = null;
    if (this.previous) {
      this.previous.next = this.next;
    }
    if (this.next) {
      this.next.previous = this.previous;
    }
    var redirect = this.next;
    this.next = hard ? null : redirect;
    this.previous = null;
    return redirect;
  };
  return TickerListener2;
}();
var Ticker = function() {
  function Ticker2() {
    var _this = this;
    this.autoStart = false;
    this.deltaTime = 1;
    this.lastTime = -1;
    this.speed = 1;
    this.started = false;
    this._requestId = null;
    this._maxElapsedMS = 100;
    this._minElapsedMS = 0;
    this._protected = false;
    this._lastFrame = -1;
    this._head = new TickerListener(null, null, Infinity);
    this.deltaMS = 1 / settings.TARGET_FPMS;
    this.elapsedMS = 1 / settings.TARGET_FPMS;
    this._tick = function(time) {
      _this._requestId = null;
      if (_this.started) {
        _this.update(time);
        if (_this.started && _this._requestId === null && _this._head.next) {
          _this._requestId = requestAnimationFrame(_this._tick);
        }
      }
    };
  }
  Ticker2.prototype._requestIfNeeded = function() {
    if (this._requestId === null && this._head.next) {
      this.lastTime = performance.now();
      this._lastFrame = this.lastTime;
      this._requestId = requestAnimationFrame(this._tick);
    }
  };
  Ticker2.prototype._cancelIfNeeded = function() {
    if (this._requestId !== null) {
      cancelAnimationFrame(this._requestId);
      this._requestId = null;
    }
  };
  Ticker2.prototype._startIfPossible = function() {
    if (this.started) {
      this._requestIfNeeded();
    } else if (this.autoStart) {
      this.start();
    }
  };
  Ticker2.prototype.add = function(fn, context2, priority) {
    if (priority === void 0) {
      priority = UPDATE_PRIORITY.NORMAL;
    }
    return this._addListener(new TickerListener(fn, context2, priority));
  };
  Ticker2.prototype.addOnce = function(fn, context2, priority) {
    if (priority === void 0) {
      priority = UPDATE_PRIORITY.NORMAL;
    }
    return this._addListener(new TickerListener(fn, context2, priority, true));
  };
  Ticker2.prototype._addListener = function(listener) {
    var current = this._head.next;
    var previous = this._head;
    if (!current) {
      listener.connect(previous);
    } else {
      while (current) {
        if (listener.priority > current.priority) {
          listener.connect(previous);
          break;
        }
        previous = current;
        current = current.next;
      }
      if (!listener.previous) {
        listener.connect(previous);
      }
    }
    this._startIfPossible();
    return this;
  };
  Ticker2.prototype.remove = function(fn, context2) {
    var listener = this._head.next;
    while (listener) {
      if (listener.match(fn, context2)) {
        listener = listener.destroy();
      } else {
        listener = listener.next;
      }
    }
    if (!this._head.next) {
      this._cancelIfNeeded();
    }
    return this;
  };
  Object.defineProperty(Ticker2.prototype, "count", {
    get: function() {
      if (!this._head) {
        return 0;
      }
      var count = 0;
      var current = this._head;
      while (current = current.next) {
        count++;
      }
      return count;
    },
    enumerable: false,
    configurable: true
  });
  Ticker2.prototype.start = function() {
    if (!this.started) {
      this.started = true;
      this._requestIfNeeded();
    }
  };
  Ticker2.prototype.stop = function() {
    if (this.started) {
      this.started = false;
      this._cancelIfNeeded();
    }
  };
  Ticker2.prototype.destroy = function() {
    if (!this._protected) {
      this.stop();
      var listener = this._head.next;
      while (listener) {
        listener = listener.destroy(true);
      }
      this._head.destroy();
      this._head = null;
    }
  };
  Ticker2.prototype.update = function(currentTime) {
    if (currentTime === void 0) {
      currentTime = performance.now();
    }
    var elapsedMS;
    if (currentTime > this.lastTime) {
      elapsedMS = this.elapsedMS = currentTime - this.lastTime;
      if (elapsedMS > this._maxElapsedMS) {
        elapsedMS = this._maxElapsedMS;
      }
      elapsedMS *= this.speed;
      if (this._minElapsedMS) {
        var delta = currentTime - this._lastFrame | 0;
        if (delta < this._minElapsedMS) {
          return;
        }
        this._lastFrame = currentTime - delta % this._minElapsedMS;
      }
      this.deltaMS = elapsedMS;
      this.deltaTime = this.deltaMS * settings.TARGET_FPMS;
      var head = this._head;
      var listener = head.next;
      while (listener) {
        listener = listener.emit(this.deltaTime);
      }
      if (!head.next) {
        this._cancelIfNeeded();
      }
    } else {
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    }
    this.lastTime = currentTime;
  };
  Object.defineProperty(Ticker2.prototype, "FPS", {
    get: function() {
      return 1e3 / this.elapsedMS;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Ticker2.prototype, "minFPS", {
    get: function() {
      return 1e3 / this._maxElapsedMS;
    },
    set: function(fps) {
      var minFPS = Math.min(this.maxFPS, fps);
      var minFPMS = Math.min(Math.max(0, minFPS) / 1e3, settings.TARGET_FPMS);
      this._maxElapsedMS = 1 / minFPMS;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Ticker2.prototype, "maxFPS", {
    get: function() {
      if (this._minElapsedMS) {
        return Math.round(1e3 / this._minElapsedMS);
      }
      return 0;
    },
    set: function(fps) {
      if (fps === 0) {
        this._minElapsedMS = 0;
      } else {
        var maxFPS = Math.max(this.minFPS, fps);
        this._minElapsedMS = 1 / (maxFPS / 1e3);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Ticker2, "shared", {
    get: function() {
      if (!Ticker2._shared) {
        var shared = Ticker2._shared = new Ticker2();
        shared.autoStart = true;
        shared._protected = true;
      }
      return Ticker2._shared;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Ticker2, "system", {
    get: function() {
      if (!Ticker2._system) {
        var system = Ticker2._system = new Ticker2();
        system.autoStart = true;
        system._protected = true;
      }
      return Ticker2._system;
    },
    enumerable: false,
    configurable: true
  });
  return Ticker2;
}();
(function() {
  function TickerPlugin() {
  }
  TickerPlugin.init = function(options) {
    var _this = this;
    options = Object.assign({
      autoStart: true,
      sharedTicker: false
    }, options);
    Object.defineProperty(this, "ticker", {
      set: function(ticker) {
        if (this._ticker) {
          this._ticker.remove(this.render, this);
        }
        this._ticker = ticker;
        if (ticker) {
          ticker.add(this.render, this, UPDATE_PRIORITY.LOW);
        }
      },
      get: function() {
        return this._ticker;
      }
    });
    this.stop = function() {
      _this._ticker.stop();
    };
    this.start = function() {
      _this._ticker.start();
    };
    this._ticker = null;
    this.ticker = options.sharedTicker ? Ticker.shared : new Ticker();
    if (options.autoStart) {
      this.start();
    }
  };
  TickerPlugin.destroy = function() {
    if (this._ticker) {
      var oldTicker = this._ticker;
      this.ticker = null;
      oldTicker.destroy();
    }
  };
  TickerPlugin.extension = ExtensionType.Application;
  return TickerPlugin;
})();
/*!
 * @pixi/math - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/math is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var PI_2 = Math.PI * 2;
var SHAPES;
(function(SHAPES2) {
  SHAPES2[SHAPES2["POLY"] = 0] = "POLY";
  SHAPES2[SHAPES2["RECT"] = 1] = "RECT";
  SHAPES2[SHAPES2["CIRC"] = 2] = "CIRC";
  SHAPES2[SHAPES2["ELIP"] = 3] = "ELIP";
  SHAPES2[SHAPES2["RREC"] = 4] = "RREC";
})(SHAPES || (SHAPES = {}));
var Point = function() {
  function Point2(x2, y2) {
    if (x2 === void 0) {
      x2 = 0;
    }
    if (y2 === void 0) {
      y2 = 0;
    }
    this.x = 0;
    this.y = 0;
    this.x = x2;
    this.y = y2;
  }
  Point2.prototype.clone = function() {
    return new Point2(this.x, this.y);
  };
  Point2.prototype.copyFrom = function(p2) {
    this.set(p2.x, p2.y);
    return this;
  };
  Point2.prototype.copyTo = function(p2) {
    p2.set(this.x, this.y);
    return p2;
  };
  Point2.prototype.equals = function(p2) {
    return p2.x === this.x && p2.y === this.y;
  };
  Point2.prototype.set = function(x2, y2) {
    if (x2 === void 0) {
      x2 = 0;
    }
    if (y2 === void 0) {
      y2 = x2;
    }
    this.x = x2;
    this.y = y2;
    return this;
  };
  Point2.prototype.toString = function() {
    return "[@pixi/math:Point x=" + this.x + " y=" + this.y + "]";
  };
  return Point2;
}();
var tempPoints$1 = [new Point(), new Point(), new Point(), new Point()];
var Rectangle = function() {
  function Rectangle2(x2, y2, width, height) {
    if (x2 === void 0) {
      x2 = 0;
    }
    if (y2 === void 0) {
      y2 = 0;
    }
    if (width === void 0) {
      width = 0;
    }
    if (height === void 0) {
      height = 0;
    }
    this.x = Number(x2);
    this.y = Number(y2);
    this.width = Number(width);
    this.height = Number(height);
    this.type = SHAPES.RECT;
  }
  Object.defineProperty(Rectangle2.prototype, "left", {
    get: function() {
      return this.x;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Rectangle2.prototype, "right", {
    get: function() {
      return this.x + this.width;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Rectangle2.prototype, "top", {
    get: function() {
      return this.y;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Rectangle2.prototype, "bottom", {
    get: function() {
      return this.y + this.height;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Rectangle2, "EMPTY", {
    get: function() {
      return new Rectangle2(0, 0, 0, 0);
    },
    enumerable: false,
    configurable: true
  });
  Rectangle2.prototype.clone = function() {
    return new Rectangle2(this.x, this.y, this.width, this.height);
  };
  Rectangle2.prototype.copyFrom = function(rectangle) {
    this.x = rectangle.x;
    this.y = rectangle.y;
    this.width = rectangle.width;
    this.height = rectangle.height;
    return this;
  };
  Rectangle2.prototype.copyTo = function(rectangle) {
    rectangle.x = this.x;
    rectangle.y = this.y;
    rectangle.width = this.width;
    rectangle.height = this.height;
    return rectangle;
  };
  Rectangle2.prototype.contains = function(x2, y2) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    if (x2 >= this.x && x2 < this.x + this.width) {
      if (y2 >= this.y && y2 < this.y + this.height) {
        return true;
      }
    }
    return false;
  };
  Rectangle2.prototype.intersects = function(other, transform) {
    if (!transform) {
      var x0_1 = this.x < other.x ? other.x : this.x;
      var x1_1 = this.right > other.right ? other.right : this.right;
      if (x1_1 <= x0_1) {
        return false;
      }
      var y0_1 = this.y < other.y ? other.y : this.y;
      var y1_1 = this.bottom > other.bottom ? other.bottom : this.bottom;
      return y1_1 > y0_1;
    }
    var x0 = this.left;
    var x1 = this.right;
    var y0 = this.top;
    var y1 = this.bottom;
    if (x1 <= x0 || y1 <= y0) {
      return false;
    }
    var lt = tempPoints$1[0].set(other.left, other.top);
    var lb = tempPoints$1[1].set(other.left, other.bottom);
    var rt = tempPoints$1[2].set(other.right, other.top);
    var rb = tempPoints$1[3].set(other.right, other.bottom);
    if (rt.x <= lt.x || lb.y <= lt.y) {
      return false;
    }
    var s2 = Math.sign(transform.a * transform.d - transform.b * transform.c);
    if (s2 === 0) {
      return false;
    }
    transform.apply(lt, lt);
    transform.apply(lb, lb);
    transform.apply(rt, rt);
    transform.apply(rb, rb);
    if (Math.max(lt.x, lb.x, rt.x, rb.x) <= x0 || Math.min(lt.x, lb.x, rt.x, rb.x) >= x1 || Math.max(lt.y, lb.y, rt.y, rb.y) <= y0 || Math.min(lt.y, lb.y, rt.y, rb.y) >= y1) {
      return false;
    }
    var nx = s2 * (lb.y - lt.y);
    var ny = s2 * (lt.x - lb.x);
    var n00 = nx * x0 + ny * y0;
    var n10 = nx * x1 + ny * y0;
    var n01 = nx * x0 + ny * y1;
    var n11 = nx * x1 + ny * y1;
    if (Math.max(n00, n10, n01, n11) <= nx * lt.x + ny * lt.y || Math.min(n00, n10, n01, n11) >= nx * rb.x + ny * rb.y) {
      return false;
    }
    var mx = s2 * (lt.y - rt.y);
    var my = s2 * (rt.x - lt.x);
    var m00 = mx * x0 + my * y0;
    var m10 = mx * x1 + my * y0;
    var m01 = mx * x0 + my * y1;
    var m11 = mx * x1 + my * y1;
    if (Math.max(m00, m10, m01, m11) <= mx * lt.x + my * lt.y || Math.min(m00, m10, m01, m11) >= mx * rb.x + my * rb.y) {
      return false;
    }
    return true;
  };
  Rectangle2.prototype.pad = function(paddingX, paddingY) {
    if (paddingX === void 0) {
      paddingX = 0;
    }
    if (paddingY === void 0) {
      paddingY = paddingX;
    }
    this.x -= paddingX;
    this.y -= paddingY;
    this.width += paddingX * 2;
    this.height += paddingY * 2;
    return this;
  };
  Rectangle2.prototype.fit = function(rectangle) {
    var x1 = Math.max(this.x, rectangle.x);
    var x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
    var y1 = Math.max(this.y, rectangle.y);
    var y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);
    this.x = x1;
    this.width = Math.max(x2 - x1, 0);
    this.y = y1;
    this.height = Math.max(y2 - y1, 0);
    return this;
  };
  Rectangle2.prototype.ceil = function(resolution, eps) {
    if (resolution === void 0) {
      resolution = 1;
    }
    if (eps === void 0) {
      eps = 1e-3;
    }
    var x2 = Math.ceil((this.x + this.width - eps) * resolution) / resolution;
    var y2 = Math.ceil((this.y + this.height - eps) * resolution) / resolution;
    this.x = Math.floor((this.x + eps) * resolution) / resolution;
    this.y = Math.floor((this.y + eps) * resolution) / resolution;
    this.width = x2 - this.x;
    this.height = y2 - this.y;
    return this;
  };
  Rectangle2.prototype.enlarge = function(rectangle) {
    var x1 = Math.min(this.x, rectangle.x);
    var x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
    var y1 = Math.min(this.y, rectangle.y);
    var y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
    this.x = x1;
    this.width = x2 - x1;
    this.y = y1;
    this.height = y2 - y1;
    return this;
  };
  Rectangle2.prototype.toString = function() {
    return "[@pixi/math:Rectangle x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
  };
  return Rectangle2;
}();
var ObservablePoint = function() {
  function ObservablePoint2(cb, scope, x2, y2) {
    if (x2 === void 0) {
      x2 = 0;
    }
    if (y2 === void 0) {
      y2 = 0;
    }
    this._x = x2;
    this._y = y2;
    this.cb = cb;
    this.scope = scope;
  }
  ObservablePoint2.prototype.clone = function(cb, scope) {
    if (cb === void 0) {
      cb = this.cb;
    }
    if (scope === void 0) {
      scope = this.scope;
    }
    return new ObservablePoint2(cb, scope, this._x, this._y);
  };
  ObservablePoint2.prototype.set = function(x2, y2) {
    if (x2 === void 0) {
      x2 = 0;
    }
    if (y2 === void 0) {
      y2 = x2;
    }
    if (this._x !== x2 || this._y !== y2) {
      this._x = x2;
      this._y = y2;
      this.cb.call(this.scope);
    }
    return this;
  };
  ObservablePoint2.prototype.copyFrom = function(p2) {
    if (this._x !== p2.x || this._y !== p2.y) {
      this._x = p2.x;
      this._y = p2.y;
      this.cb.call(this.scope);
    }
    return this;
  };
  ObservablePoint2.prototype.copyTo = function(p2) {
    p2.set(this._x, this._y);
    return p2;
  };
  ObservablePoint2.prototype.equals = function(p2) {
    return p2.x === this._x && p2.y === this._y;
  };
  ObservablePoint2.prototype.toString = function() {
    return "[@pixi/math:ObservablePoint x=" + 0 + " y=" + 0 + " scope=" + this.scope + "]";
  };
  Object.defineProperty(ObservablePoint2.prototype, "x", {
    get: function() {
      return this._x;
    },
    set: function(value) {
      if (this._x !== value) {
        this._x = value;
        this.cb.call(this.scope);
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ObservablePoint2.prototype, "y", {
    get: function() {
      return this._y;
    },
    set: function(value) {
      if (this._y !== value) {
        this._y = value;
        this.cb.call(this.scope);
      }
    },
    enumerable: false,
    configurable: true
  });
  return ObservablePoint2;
}();
var Matrix = function() {
  function Matrix2(a2, b2, c2, d2, tx, ty) {
    if (a2 === void 0) {
      a2 = 1;
    }
    if (b2 === void 0) {
      b2 = 0;
    }
    if (c2 === void 0) {
      c2 = 0;
    }
    if (d2 === void 0) {
      d2 = 1;
    }
    if (tx === void 0) {
      tx = 0;
    }
    if (ty === void 0) {
      ty = 0;
    }
    this.array = null;
    this.a = a2;
    this.b = b2;
    this.c = c2;
    this.d = d2;
    this.tx = tx;
    this.ty = ty;
  }
  Matrix2.prototype.fromArray = function(array) {
    this.a = array[0];
    this.b = array[1];
    this.c = array[3];
    this.d = array[4];
    this.tx = array[2];
    this.ty = array[5];
  };
  Matrix2.prototype.set = function(a2, b2, c2, d2, tx, ty) {
    this.a = a2;
    this.b = b2;
    this.c = c2;
    this.d = d2;
    this.tx = tx;
    this.ty = ty;
    return this;
  };
  Matrix2.prototype.toArray = function(transpose, out) {
    if (!this.array) {
      this.array = new Float32Array(9);
    }
    var array = out || this.array;
    if (transpose) {
      array[0] = this.a;
      array[1] = this.b;
      array[2] = 0;
      array[3] = this.c;
      array[4] = this.d;
      array[5] = 0;
      array[6] = this.tx;
      array[7] = this.ty;
      array[8] = 1;
    } else {
      array[0] = this.a;
      array[1] = this.c;
      array[2] = this.tx;
      array[3] = this.b;
      array[4] = this.d;
      array[5] = this.ty;
      array[6] = 0;
      array[7] = 0;
      array[8] = 1;
    }
    return array;
  };
  Matrix2.prototype.apply = function(pos, newPos) {
    newPos = newPos || new Point();
    var x2 = pos.x;
    var y2 = pos.y;
    newPos.x = this.a * x2 + this.c * y2 + this.tx;
    newPos.y = this.b * x2 + this.d * y2 + this.ty;
    return newPos;
  };
  Matrix2.prototype.applyInverse = function(pos, newPos) {
    newPos = newPos || new Point();
    var id = 1 / (this.a * this.d + this.c * -this.b);
    var x2 = pos.x;
    var y2 = pos.y;
    newPos.x = this.d * id * x2 + -this.c * id * y2 + (this.ty * this.c - this.tx * this.d) * id;
    newPos.y = this.a * id * y2 + -this.b * id * x2 + (-this.ty * this.a + this.tx * this.b) * id;
    return newPos;
  };
  Matrix2.prototype.translate = function(x2, y2) {
    this.tx += x2;
    this.ty += y2;
    return this;
  };
  Matrix2.prototype.scale = function(x2, y2) {
    this.a *= x2;
    this.d *= y2;
    this.c *= x2;
    this.b *= y2;
    this.tx *= x2;
    this.ty *= y2;
    return this;
  };
  Matrix2.prototype.rotate = function(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var a1 = this.a;
    var c1 = this.c;
    var tx1 = this.tx;
    this.a = a1 * cos - this.b * sin;
    this.b = a1 * sin + this.b * cos;
    this.c = c1 * cos - this.d * sin;
    this.d = c1 * sin + this.d * cos;
    this.tx = tx1 * cos - this.ty * sin;
    this.ty = tx1 * sin + this.ty * cos;
    return this;
  };
  Matrix2.prototype.append = function(matrix) {
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;
    this.a = matrix.a * a1 + matrix.b * c1;
    this.b = matrix.a * b1 + matrix.b * d1;
    this.c = matrix.c * a1 + matrix.d * c1;
    this.d = matrix.c * b1 + matrix.d * d1;
    this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
    this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
    return this;
  };
  Matrix2.prototype.setTransform = function(x2, y2, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
    this.a = Math.cos(rotation + skewY) * scaleX;
    this.b = Math.sin(rotation + skewY) * scaleX;
    this.c = -Math.sin(rotation - skewX) * scaleY;
    this.d = Math.cos(rotation - skewX) * scaleY;
    this.tx = x2 - (pivotX * this.a + pivotY * this.c);
    this.ty = y2 - (pivotX * this.b + pivotY * this.d);
    return this;
  };
  Matrix2.prototype.prepend = function(matrix) {
    var tx1 = this.tx;
    if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
      var a1 = this.a;
      var c1 = this.c;
      this.a = a1 * matrix.a + this.b * matrix.c;
      this.b = a1 * matrix.b + this.b * matrix.d;
      this.c = c1 * matrix.a + this.d * matrix.c;
      this.d = c1 * matrix.b + this.d * matrix.d;
    }
    this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
    this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;
    return this;
  };
  Matrix2.prototype.decompose = function(transform) {
    var a2 = this.a;
    var b2 = this.b;
    var c2 = this.c;
    var d2 = this.d;
    var pivot = transform.pivot;
    var skewX = -Math.atan2(-c2, d2);
    var skewY = Math.atan2(b2, a2);
    var delta = Math.abs(skewX + skewY);
    if (delta < 1e-5 || Math.abs(PI_2 - delta) < 1e-5) {
      transform.rotation = skewY;
      transform.skew.x = transform.skew.y = 0;
    } else {
      transform.rotation = 0;
      transform.skew.x = skewX;
      transform.skew.y = skewY;
    }
    transform.scale.x = Math.sqrt(a2 * a2 + b2 * b2);
    transform.scale.y = Math.sqrt(c2 * c2 + d2 * d2);
    transform.position.x = this.tx + (pivot.x * a2 + pivot.y * c2);
    transform.position.y = this.ty + (pivot.x * b2 + pivot.y * d2);
    return transform;
  };
  Matrix2.prototype.invert = function() {
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;
    var tx1 = this.tx;
    var n2 = a1 * d1 - b1 * c1;
    this.a = d1 / n2;
    this.b = -b1 / n2;
    this.c = -c1 / n2;
    this.d = a1 / n2;
    this.tx = (c1 * this.ty - d1 * tx1) / n2;
    this.ty = -(a1 * this.ty - b1 * tx1) / n2;
    return this;
  };
  Matrix2.prototype.identity = function() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
    return this;
  };
  Matrix2.prototype.clone = function() {
    var matrix = new Matrix2();
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;
    return matrix;
  };
  Matrix2.prototype.copyTo = function(matrix) {
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;
    return matrix;
  };
  Matrix2.prototype.copyFrom = function(matrix) {
    this.a = matrix.a;
    this.b = matrix.b;
    this.c = matrix.c;
    this.d = matrix.d;
    this.tx = matrix.tx;
    this.ty = matrix.ty;
    return this;
  };
  Matrix2.prototype.toString = function() {
    return "[@pixi/math:Matrix a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + "]";
  };
  Object.defineProperty(Matrix2, "IDENTITY", {
    get: function() {
      return new Matrix2();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Matrix2, "TEMP_MATRIX", {
    get: function() {
      return new Matrix2();
    },
    enumerable: false,
    configurable: true
  });
  return Matrix2;
}();
var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
var rotationCayley = [];
var rotationMatrices = [];
var signum = Math.sign;
function init() {
  for (var i = 0; i < 16; i++) {
    var row = [];
    rotationCayley.push(row);
    for (var j2 = 0; j2 < 16; j2++) {
      var _ux = signum(ux[i] * ux[j2] + vx[i] * uy[j2]);
      var _uy = signum(uy[i] * ux[j2] + vy[i] * uy[j2]);
      var _vx = signum(ux[i] * vx[j2] + vx[i] * vy[j2]);
      var _vy = signum(uy[i] * vx[j2] + vy[i] * vy[j2]);
      for (var k = 0; k < 16; k++) {
        if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
          row.push(k);
          break;
        }
      }
    }
  }
  for (var i = 0; i < 16; i++) {
    var mat = new Matrix();
    mat.set(ux[i], uy[i], vx[i], vy[i], 0, 0);
    rotationMatrices.push(mat);
  }
}
init();
var groupD8 = {
  E: 0,
  SE: 1,
  S: 2,
  SW: 3,
  W: 4,
  NW: 5,
  N: 6,
  NE: 7,
  MIRROR_VERTICAL: 8,
  MAIN_DIAGONAL: 10,
  MIRROR_HORIZONTAL: 12,
  REVERSE_DIAGONAL: 14,
  uX: function(ind) {
    return ux[ind];
  },
  uY: function(ind) {
    return uy[ind];
  },
  vX: function(ind) {
    return vx[ind];
  },
  vY: function(ind) {
    return vy[ind];
  },
  inv: function(rotation) {
    if (rotation & 8) {
      return rotation & 15;
    }
    return -rotation & 7;
  },
  add: function(rotationSecond, rotationFirst) {
    return rotationCayley[rotationSecond][rotationFirst];
  },
  sub: function(rotationSecond, rotationFirst) {
    return rotationCayley[rotationSecond][groupD8.inv(rotationFirst)];
  },
  rotate180: function(rotation) {
    return rotation ^ 4;
  },
  isVertical: function(rotation) {
    return (rotation & 3) === 2;
  },
  byDirection: function(dx, dy) {
    if (Math.abs(dx) * 2 <= Math.abs(dy)) {
      if (dy >= 0) {
        return groupD8.S;
      }
      return groupD8.N;
    } else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
      if (dx > 0) {
        return groupD8.E;
      }
      return groupD8.W;
    } else if (dy > 0) {
      if (dx > 0) {
        return groupD8.SE;
      }
      return groupD8.SW;
    } else if (dx > 0) {
      return groupD8.NE;
    }
    return groupD8.NW;
  },
  matrixAppendRotationInv: function(matrix, rotation, tx, ty) {
    if (tx === void 0) {
      tx = 0;
    }
    if (ty === void 0) {
      ty = 0;
    }
    var mat = rotationMatrices[groupD8.inv(rotation)];
    mat.tx = tx;
    mat.ty = ty;
    matrix.append(mat);
  }
};
(function() {
  function Transform() {
    this.worldTransform = new Matrix();
    this.localTransform = new Matrix();
    this.position = new ObservablePoint(this.onChange, this, 0, 0);
    this.scale = new ObservablePoint(this.onChange, this, 1, 1);
    this.pivot = new ObservablePoint(this.onChange, this, 0, 0);
    this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);
    this._rotation = 0;
    this._cx = 1;
    this._sx = 0;
    this._cy = 0;
    this._sy = 1;
    this._localID = 0;
    this._currentLocalID = 0;
    this._worldID = 0;
    this._parentID = 0;
  }
  Transform.prototype.onChange = function() {
    this._localID++;
  };
  Transform.prototype.updateSkew = function() {
    this._cx = Math.cos(this._rotation + this.skew.y);
    this._sx = Math.sin(this._rotation + this.skew.y);
    this._cy = -Math.sin(this._rotation - this.skew.x);
    this._sy = Math.cos(this._rotation - this.skew.x);
    this._localID++;
  };
  Transform.prototype.toString = function() {
    return "[@pixi/math:Transform " + ("position=(" + this.position.x + ", " + this.position.y + ") ") + ("rotation=" + this.rotation + " ") + ("scale=(" + this.scale.x + ", " + this.scale.y + ") ") + ("skew=(" + this.skew.x + ", " + this.skew.y + ") ") + "]";
  };
  Transform.prototype.updateLocalTransform = function() {
    var lt = this.localTransform;
    if (this._localID !== this._currentLocalID) {
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;
      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;
      this._parentID = -1;
    }
  };
  Transform.prototype.updateTransform = function(parentTransform) {
    var lt = this.localTransform;
    if (this._localID !== this._currentLocalID) {
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;
      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;
      this._parentID = -1;
    }
    if (this._parentID !== parentTransform._worldID) {
      var pt = parentTransform.worldTransform;
      var wt = this.worldTransform;
      wt.a = lt.a * pt.a + lt.b * pt.c;
      wt.b = lt.a * pt.b + lt.b * pt.d;
      wt.c = lt.c * pt.a + lt.d * pt.c;
      wt.d = lt.c * pt.b + lt.d * pt.d;
      wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
      wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
      this._parentID = parentTransform._worldID;
      this._worldID++;
    }
  };
  Transform.prototype.setFromMatrix = function(matrix) {
    matrix.decompose(this);
    this._localID++;
  };
  Object.defineProperty(Transform.prototype, "rotation", {
    get: function() {
      return this._rotation;
    },
    set: function(value) {
      if (this._rotation !== value) {
        this._rotation = value;
        this.updateSkew();
      }
    },
    enumerable: false,
    configurable: true
  });
  Transform.IDENTITY = new Transform();
  return Transform;
})();
/*!
 * @pixi/core - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/core is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
settings.PREFER_ENV = isMobile.any ? ENV.WEBGL : ENV.WEBGL2;
settings.STRICT_TEXTURE_CACHE = false;
var INSTALLED = [];
function autoDetectResource(source, options) {
  if (!source) {
    return null;
  }
  var extension = "";
  if (typeof source === "string") {
    var result = /\.(\w{3,4})(?:$|\?|#)/i.exec(source);
    if (result) {
      extension = result[1].toLowerCase();
    }
  }
  for (var i = INSTALLED.length - 1; i >= 0; --i) {
    var ResourcePlugin = INSTALLED[i];
    if (ResourcePlugin.test && ResourcePlugin.test(source, extension)) {
      return new ResourcePlugin(source, options);
    }
  }
  throw new Error("Unrecognized source type to auto-detect Resource");
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d2, b2) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
    d3.__proto__ = b3;
  } || function(d3, b3) {
    for (var p2 in b3) {
      if (b3.hasOwnProperty(p2)) {
        d3[p2] = b3[p2];
      }
    }
  };
  return extendStatics(d2, b2);
};
function __extends(d2, b2) {
  extendStatics(d2, b2);
  function __() {
    this.constructor = d2;
  }
  d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    var arguments$1 = arguments;
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments$1[i];
      for (var p2 in s2) {
        if (Object.prototype.hasOwnProperty.call(s2, p2)) {
          t[p2] = s2[p2];
        }
      }
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s2, e) {
  var t = {};
  for (var p2 in s2) {
    if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0) {
      t[p2] = s2[p2];
    }
  }
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function") {
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i])) {
        t[p2[i]] = s2[p2[i]];
      }
    }
  }
  return t;
}
var Resource = function() {
  function Resource2(width, height) {
    if (width === void 0) {
      width = 0;
    }
    if (height === void 0) {
      height = 0;
    }
    this._width = width;
    this._height = height;
    this.destroyed = false;
    this.internal = false;
    this.onResize = new Runner("setRealSize");
    this.onUpdate = new Runner("update");
    this.onError = new Runner("onError");
  }
  Resource2.prototype.bind = function(baseTexture) {
    this.onResize.add(baseTexture);
    this.onUpdate.add(baseTexture);
    this.onError.add(baseTexture);
    if (this._width || this._height) {
      this.onResize.emit(this._width, this._height);
    }
  };
  Resource2.prototype.unbind = function(baseTexture) {
    this.onResize.remove(baseTexture);
    this.onUpdate.remove(baseTexture);
    this.onError.remove(baseTexture);
  };
  Resource2.prototype.resize = function(width, height) {
    if (width !== this._width || height !== this._height) {
      this._width = width;
      this._height = height;
      this.onResize.emit(width, height);
    }
  };
  Object.defineProperty(Resource2.prototype, "valid", {
    get: function() {
      return !!this._width && !!this._height;
    },
    enumerable: false,
    configurable: true
  });
  Resource2.prototype.update = function() {
    if (!this.destroyed) {
      this.onUpdate.emit();
    }
  };
  Resource2.prototype.load = function() {
    return Promise.resolve(this);
  };
  Object.defineProperty(Resource2.prototype, "width", {
    get: function() {
      return this._width;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource2.prototype, "height", {
    get: function() {
      return this._height;
    },
    enumerable: false,
    configurable: true
  });
  Resource2.prototype.style = function(_renderer, _baseTexture, _glTexture) {
    return false;
  };
  Resource2.prototype.dispose = function() {
  };
  Resource2.prototype.destroy = function() {
    if (!this.destroyed) {
      this.destroyed = true;
      this.dispose();
      this.onError.removeAll();
      this.onError = null;
      this.onResize.removeAll();
      this.onResize = null;
      this.onUpdate.removeAll();
      this.onUpdate = null;
    }
  };
  Resource2.test = function(_source, _extension) {
    return false;
  };
  return Resource2;
}();
var BufferResource = function(_super) {
  __extends(BufferResource2, _super);
  function BufferResource2(source, options) {
    var _this = this;
    var _a = options || {}, width = _a.width, height = _a.height;
    if (!width || !height) {
      throw new Error("BufferResource width or height invalid");
    }
    _this = _super.call(this, width, height) || this;
    _this.data = source;
    return _this;
  }
  BufferResource2.prototype.upload = function(renderer, baseTexture, glTexture) {
    var gl = renderer.gl;
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
    var width = baseTexture.realWidth;
    var height = baseTexture.realHeight;
    if (glTexture.width === width && glTexture.height === height) {
      gl.texSubImage2D(baseTexture.target, 0, 0, 0, width, height, baseTexture.format, glTexture.type, this.data);
    } else {
      glTexture.width = width;
      glTexture.height = height;
      gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, width, height, 0, baseTexture.format, glTexture.type, this.data);
    }
    return true;
  };
  BufferResource2.prototype.dispose = function() {
    this.data = null;
  };
  BufferResource2.test = function(source) {
    return source instanceof Float32Array || source instanceof Uint8Array || source instanceof Uint32Array;
  };
  return BufferResource2;
}(Resource);
var defaultBufferOptions = {
  scaleMode: SCALE_MODES.NEAREST,
  format: FORMATS.RGBA,
  alphaMode: ALPHA_MODES.NPM
};
var BaseTexture = function(_super) {
  __extends(BaseTexture2, _super);
  function BaseTexture2(resource, options) {
    if (resource === void 0) {
      resource = null;
    }
    if (options === void 0) {
      options = null;
    }
    var _this = _super.call(this) || this;
    options = options || {};
    var alphaMode = options.alphaMode, mipmap = options.mipmap, anisotropicLevel = options.anisotropicLevel, scaleMode = options.scaleMode, width = options.width, height = options.height, wrapMode = options.wrapMode, format2 = options.format, type = options.type, target = options.target, resolution = options.resolution, resourceOptions = options.resourceOptions;
    if (resource && !(resource instanceof Resource)) {
      resource = autoDetectResource(resource, resourceOptions);
      resource.internal = true;
    }
    _this.resolution = resolution || settings.RESOLUTION;
    _this.width = Math.round((width || 0) * _this.resolution) / _this.resolution;
    _this.height = Math.round((height || 0) * _this.resolution) / _this.resolution;
    _this._mipmap = mipmap !== void 0 ? mipmap : settings.MIPMAP_TEXTURES;
    _this.anisotropicLevel = anisotropicLevel !== void 0 ? anisotropicLevel : settings.ANISOTROPIC_LEVEL;
    _this._wrapMode = wrapMode || settings.WRAP_MODE;
    _this._scaleMode = scaleMode !== void 0 ? scaleMode : settings.SCALE_MODE;
    _this.format = format2 || FORMATS.RGBA;
    _this.type = type || TYPES.UNSIGNED_BYTE;
    _this.target = target || TARGETS.TEXTURE_2D;
    _this.alphaMode = alphaMode !== void 0 ? alphaMode : ALPHA_MODES.UNPACK;
    _this.uid = uid();
    _this.touched = 0;
    _this.isPowerOfTwo = false;
    _this._refreshPOT();
    _this._glTextures = {};
    _this.dirtyId = 0;
    _this.dirtyStyleId = 0;
    _this.cacheId = null;
    _this.valid = width > 0 && height > 0;
    _this.textureCacheIds = [];
    _this.destroyed = false;
    _this.resource = null;
    _this._batchEnabled = 0;
    _this._batchLocation = 0;
    _this.parentTextureArray = null;
    _this.setResource(resource);
    return _this;
  }
  Object.defineProperty(BaseTexture2.prototype, "realWidth", {
    get: function() {
      return Math.round(this.width * this.resolution);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(BaseTexture2.prototype, "realHeight", {
    get: function() {
      return Math.round(this.height * this.resolution);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(BaseTexture2.prototype, "mipmap", {
    get: function() {
      return this._mipmap;
    },
    set: function(value) {
      if (this._mipmap !== value) {
        this._mipmap = value;
        this.dirtyStyleId++;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(BaseTexture2.prototype, "scaleMode", {
    get: function() {
      return this._scaleMode;
    },
    set: function(value) {
      if (this._scaleMode !== value) {
        this._scaleMode = value;
        this.dirtyStyleId++;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(BaseTexture2.prototype, "wrapMode", {
    get: function() {
      return this._wrapMode;
    },
    set: function(value) {
      if (this._wrapMode !== value) {
        this._wrapMode = value;
        this.dirtyStyleId++;
      }
    },
    enumerable: false,
    configurable: true
  });
  BaseTexture2.prototype.setStyle = function(scaleMode, mipmap) {
    var dirty;
    if (scaleMode !== void 0 && scaleMode !== this.scaleMode) {
      this.scaleMode = scaleMode;
      dirty = true;
    }
    if (mipmap !== void 0 && mipmap !== this.mipmap) {
      this.mipmap = mipmap;
      dirty = true;
    }
    if (dirty) {
      this.dirtyStyleId++;
    }
    return this;
  };
  BaseTexture2.prototype.setSize = function(desiredWidth, desiredHeight, resolution) {
    resolution = resolution || this.resolution;
    return this.setRealSize(desiredWidth * resolution, desiredHeight * resolution, resolution);
  };
  BaseTexture2.prototype.setRealSize = function(realWidth, realHeight, resolution) {
    this.resolution = resolution || this.resolution;
    this.width = Math.round(realWidth) / this.resolution;
    this.height = Math.round(realHeight) / this.resolution;
    this._refreshPOT();
    this.update();
    return this;
  };
  BaseTexture2.prototype._refreshPOT = function() {
    this.isPowerOfTwo = isPow2(this.realWidth) && isPow2(this.realHeight);
  };
  BaseTexture2.prototype.setResolution = function(resolution) {
    var oldResolution = this.resolution;
    if (oldResolution === resolution) {
      return this;
    }
    this.resolution = resolution;
    if (this.valid) {
      this.width = Math.round(this.width * oldResolution) / resolution;
      this.height = Math.round(this.height * oldResolution) / resolution;
      this.emit("update", this);
    }
    this._refreshPOT();
    return this;
  };
  BaseTexture2.prototype.setResource = function(resource) {
    if (this.resource === resource) {
      return this;
    }
    if (this.resource) {
      throw new Error("Resource can be set only once");
    }
    resource.bind(this);
    this.resource = resource;
    return this;
  };
  BaseTexture2.prototype.update = function() {
    if (!this.valid) {
      if (this.width > 0 && this.height > 0) {
        this.valid = true;
        this.emit("loaded", this);
        this.emit("update", this);
      }
    } else {
      this.dirtyId++;
      this.dirtyStyleId++;
      this.emit("update", this);
    }
  };
  BaseTexture2.prototype.onError = function(event) {
    this.emit("error", this, event);
  };
  BaseTexture2.prototype.destroy = function() {
    if (this.resource) {
      this.resource.unbind(this);
      if (this.resource.internal) {
        this.resource.destroy();
      }
      this.resource = null;
    }
    if (this.cacheId) {
      delete BaseTextureCache[this.cacheId];
      delete TextureCache[this.cacheId];
      this.cacheId = null;
    }
    this.dispose();
    BaseTexture2.removeFromCache(this);
    this.textureCacheIds = null;
    this.destroyed = true;
  };
  BaseTexture2.prototype.dispose = function() {
    this.emit("dispose", this);
  };
  BaseTexture2.prototype.castToBaseTexture = function() {
    return this;
  };
  BaseTexture2.from = function(source, options, strict) {
    if (strict === void 0) {
      strict = settings.STRICT_TEXTURE_CACHE;
    }
    var isFrame = typeof source === "string";
    var cacheId = null;
    if (isFrame) {
      cacheId = source;
    } else {
      if (!source._pixiId) {
        var prefix = options && options.pixiIdPrefix || "pixiid";
        source._pixiId = prefix + "_" + uid();
      }
      cacheId = source._pixiId;
    }
    var baseTexture = BaseTextureCache[cacheId];
    if (isFrame && strict && !baseTexture) {
      throw new Error('The cacheId "' + cacheId + '" does not exist in BaseTextureCache.');
    }
    if (!baseTexture) {
      baseTexture = new BaseTexture2(source, options);
      baseTexture.cacheId = cacheId;
      BaseTexture2.addToCache(baseTexture, cacheId);
    }
    return baseTexture;
  };
  BaseTexture2.fromBuffer = function(buffer, width, height, options) {
    buffer = buffer || new Float32Array(width * height * 4);
    var resource = new BufferResource(buffer, { width, height });
    var type = buffer instanceof Float32Array ? TYPES.FLOAT : TYPES.UNSIGNED_BYTE;
    return new BaseTexture2(resource, Object.assign(defaultBufferOptions, options || { width, height, type }));
  };
  BaseTexture2.addToCache = function(baseTexture, id) {
    if (id) {
      if (baseTexture.textureCacheIds.indexOf(id) === -1) {
        baseTexture.textureCacheIds.push(id);
      }
      if (BaseTextureCache[id]) {
        console.warn("BaseTexture added to the cache with an id [" + id + "] that already had an entry");
      }
      BaseTextureCache[id] = baseTexture;
    }
  };
  BaseTexture2.removeFromCache = function(baseTexture) {
    if (typeof baseTexture === "string") {
      var baseTextureFromCache = BaseTextureCache[baseTexture];
      if (baseTextureFromCache) {
        var index = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);
        if (index > -1) {
          baseTextureFromCache.textureCacheIds.splice(index, 1);
        }
        delete BaseTextureCache[baseTexture];
        return baseTextureFromCache;
      }
    } else if (baseTexture && baseTexture.textureCacheIds) {
      for (var i = 0; i < baseTexture.textureCacheIds.length; ++i) {
        delete BaseTextureCache[baseTexture.textureCacheIds[i]];
      }
      baseTexture.textureCacheIds.length = 0;
      return baseTexture;
    }
    return null;
  };
  BaseTexture2._globalBatch = 0;
  return BaseTexture2;
}(n);
var AbstractMultiResource = function(_super) {
  __extends(AbstractMultiResource2, _super);
  function AbstractMultiResource2(length, options) {
    var _this = this;
    var _a = options || {}, width = _a.width, height = _a.height;
    _this = _super.call(this, width, height) || this;
    _this.items = [];
    _this.itemDirtyIds = [];
    for (var i = 0; i < length; i++) {
      var partTexture = new BaseTexture();
      _this.items.push(partTexture);
      _this.itemDirtyIds.push(-2);
    }
    _this.length = length;
    _this._load = null;
    _this.baseTexture = null;
    return _this;
  }
  AbstractMultiResource2.prototype.initFromArray = function(resources, options) {
    for (var i = 0; i < this.length; i++) {
      if (!resources[i]) {
        continue;
      }
      if (resources[i].castToBaseTexture) {
        this.addBaseTextureAt(resources[i].castToBaseTexture(), i);
      } else if (resources[i] instanceof Resource) {
        this.addResourceAt(resources[i], i);
      } else {
        this.addResourceAt(autoDetectResource(resources[i], options), i);
      }
    }
  };
  AbstractMultiResource2.prototype.dispose = function() {
    for (var i = 0, len = this.length; i < len; i++) {
      this.items[i].destroy();
    }
    this.items = null;
    this.itemDirtyIds = null;
    this._load = null;
  };
  AbstractMultiResource2.prototype.addResourceAt = function(resource, index) {
    if (!this.items[index]) {
      throw new Error("Index " + index + " is out of bounds");
    }
    if (resource.valid && !this.valid) {
      this.resize(resource.width, resource.height);
    }
    this.items[index].setResource(resource);
    return this;
  };
  AbstractMultiResource2.prototype.bind = function(baseTexture) {
    if (this.baseTexture !== null) {
      throw new Error("Only one base texture per TextureArray is allowed");
    }
    _super.prototype.bind.call(this, baseTexture);
    for (var i = 0; i < this.length; i++) {
      this.items[i].parentTextureArray = baseTexture;
      this.items[i].on("update", baseTexture.update, baseTexture);
    }
  };
  AbstractMultiResource2.prototype.unbind = function(baseTexture) {
    _super.prototype.unbind.call(this, baseTexture);
    for (var i = 0; i < this.length; i++) {
      this.items[i].parentTextureArray = null;
      this.items[i].off("update", baseTexture.update, baseTexture);
    }
  };
  AbstractMultiResource2.prototype.load = function() {
    var _this = this;
    if (this._load) {
      return this._load;
    }
    var resources = this.items.map(function(item) {
      return item.resource;
    }).filter(function(item) {
      return item;
    });
    var promises = resources.map(function(item) {
      return item.load();
    });
    this._load = Promise.all(promises).then(function() {
      var _a = _this.items[0], realWidth = _a.realWidth, realHeight = _a.realHeight;
      _this.resize(realWidth, realHeight);
      return Promise.resolve(_this);
    });
    return this._load;
  };
  return AbstractMultiResource2;
}(Resource);
var ArrayResource = function(_super) {
  __extends(ArrayResource2, _super);
  function ArrayResource2(source, options) {
    var _this = this;
    var _a = options || {}, width = _a.width, height = _a.height;
    var urls;
    var length;
    if (Array.isArray(source)) {
      urls = source;
      length = source.length;
    } else {
      length = source;
    }
    _this = _super.call(this, length, { width, height }) || this;
    if (urls) {
      _this.initFromArray(urls, options);
    }
    return _this;
  }
  ArrayResource2.prototype.addBaseTextureAt = function(baseTexture, index) {
    if (baseTexture.resource) {
      this.addResourceAt(baseTexture.resource, index);
    } else {
      throw new Error("ArrayResource does not support RenderTexture");
    }
    return this;
  };
  ArrayResource2.prototype.bind = function(baseTexture) {
    _super.prototype.bind.call(this, baseTexture);
    baseTexture.target = TARGETS.TEXTURE_2D_ARRAY;
  };
  ArrayResource2.prototype.upload = function(renderer, texture, glTexture) {
    var _a = this, length = _a.length, itemDirtyIds = _a.itemDirtyIds, items = _a.items;
    var gl = renderer.gl;
    if (glTexture.dirtyId < 0) {
      gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, glTexture.internalFormat, this._width, this._height, length, 0, texture.format, glTexture.type, null);
    }
    for (var i = 0; i < length; i++) {
      var item = items[i];
      if (itemDirtyIds[i] < item.dirtyId) {
        itemDirtyIds[i] = item.dirtyId;
        if (item.valid) {
          gl.texSubImage3D(
            gl.TEXTURE_2D_ARRAY,
            0,
            0,
            0,
            i,
            item.resource.width,
            item.resource.height,
            1,
            texture.format,
            glTexture.type,
            item.resource.source
          );
        }
      }
    }
    return true;
  };
  return ArrayResource2;
}(AbstractMultiResource);
var BaseImageResource = function(_super) {
  __extends(BaseImageResource2, _super);
  function BaseImageResource2(source) {
    var _this = this;
    var sourceAny = source;
    var width = sourceAny.naturalWidth || sourceAny.videoWidth || sourceAny.width;
    var height = sourceAny.naturalHeight || sourceAny.videoHeight || sourceAny.height;
    _this = _super.call(this, width, height) || this;
    _this.source = source;
    _this.noSubImage = false;
    return _this;
  }
  BaseImageResource2.crossOrigin = function(element, url2, crossorigin) {
    if (crossorigin === void 0 && url2.indexOf("data:") !== 0) {
      element.crossOrigin = determineCrossOrigin(url2);
    } else if (crossorigin !== false) {
      element.crossOrigin = typeof crossorigin === "string" ? crossorigin : "anonymous";
    }
  };
  BaseImageResource2.prototype.upload = function(renderer, baseTexture, glTexture, source) {
    var gl = renderer.gl;
    var width = baseTexture.realWidth;
    var height = baseTexture.realHeight;
    source = source || this.source;
    if (source instanceof HTMLImageElement) {
      if (!source.complete || source.naturalWidth === 0) {
        return false;
      }
    } else if (source instanceof HTMLVideoElement) {
      if (source.readyState <= 1) {
        return false;
      }
    }
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
    if (!this.noSubImage && baseTexture.target === gl.TEXTURE_2D && glTexture.width === width && glTexture.height === height) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, baseTexture.format, glTexture.type, source);
    } else {
      glTexture.width = width;
      glTexture.height = height;
      gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, baseTexture.format, glTexture.type, source);
    }
    return true;
  };
  BaseImageResource2.prototype.update = function() {
    if (this.destroyed) {
      return;
    }
    var source = this.source;
    var width = source.naturalWidth || source.videoWidth || source.width;
    var height = source.naturalHeight || source.videoHeight || source.height;
    this.resize(width, height);
    _super.prototype.update.call(this);
  };
  BaseImageResource2.prototype.dispose = function() {
    this.source = null;
  };
  return BaseImageResource2;
}(Resource);
var CanvasResource = function(_super) {
  __extends(CanvasResource2, _super);
  function CanvasResource2(source) {
    return _super.call(this, source) || this;
  }
  CanvasResource2.test = function(source) {
    var OffscreenCanvas = globalThis.OffscreenCanvas;
    if (OffscreenCanvas && source instanceof OffscreenCanvas) {
      return true;
    }
    return globalThis.HTMLCanvasElement && source instanceof HTMLCanvasElement;
  };
  return CanvasResource2;
}(BaseImageResource);
var CubeResource = function(_super) {
  __extends(CubeResource2, _super);
  function CubeResource2(source, options) {
    var _this = this;
    var _a = options || {}, width = _a.width, height = _a.height, autoLoad = _a.autoLoad, linkBaseTexture = _a.linkBaseTexture;
    if (source && source.length !== CubeResource2.SIDES) {
      throw new Error("Invalid length. Got " + source.length + ", expected 6");
    }
    _this = _super.call(this, 6, { width, height }) || this;
    for (var i = 0; i < CubeResource2.SIDES; i++) {
      _this.items[i].target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i;
    }
    _this.linkBaseTexture = linkBaseTexture !== false;
    if (source) {
      _this.initFromArray(source, options);
    }
    if (autoLoad !== false) {
      _this.load();
    }
    return _this;
  }
  CubeResource2.prototype.bind = function(baseTexture) {
    _super.prototype.bind.call(this, baseTexture);
    baseTexture.target = TARGETS.TEXTURE_CUBE_MAP;
  };
  CubeResource2.prototype.addBaseTextureAt = function(baseTexture, index, linkBaseTexture) {
    if (!this.items[index]) {
      throw new Error("Index " + index + " is out of bounds");
    }
    if (!this.linkBaseTexture || baseTexture.parentTextureArray || Object.keys(baseTexture._glTextures).length > 0) {
      if (baseTexture.resource) {
        this.addResourceAt(baseTexture.resource, index);
      } else {
        throw new Error("CubeResource does not support copying of renderTexture.");
      }
    } else {
      baseTexture.target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index;
      baseTexture.parentTextureArray = this.baseTexture;
      this.items[index] = baseTexture;
    }
    if (baseTexture.valid && !this.valid) {
      this.resize(baseTexture.realWidth, baseTexture.realHeight);
    }
    this.items[index] = baseTexture;
    return this;
  };
  CubeResource2.prototype.upload = function(renderer, _baseTexture, glTexture) {
    var dirty = this.itemDirtyIds;
    for (var i = 0; i < CubeResource2.SIDES; i++) {
      var side = this.items[i];
      if (dirty[i] < side.dirtyId || glTexture.dirtyId < _baseTexture.dirtyId) {
        if (side.valid && side.resource) {
          side.resource.upload(renderer, side, glTexture);
          dirty[i] = side.dirtyId;
        } else if (dirty[i] < -1) {
          renderer.gl.texImage2D(side.target, 0, glTexture.internalFormat, _baseTexture.realWidth, _baseTexture.realHeight, 0, _baseTexture.format, glTexture.type, null);
          dirty[i] = -1;
        }
      }
    }
    return true;
  };
  CubeResource2.test = function(source) {
    return Array.isArray(source) && source.length === CubeResource2.SIDES;
  };
  CubeResource2.SIDES = 6;
  return CubeResource2;
}(AbstractMultiResource);
var ImageResource = function(_super) {
  __extends(ImageResource2, _super);
  function ImageResource2(source, options) {
    var _this = this;
    options = options || {};
    if (!(source instanceof HTMLImageElement)) {
      var imageElement = new Image();
      BaseImageResource.crossOrigin(imageElement, source, options.crossorigin);
      imageElement.src = source;
      source = imageElement;
    }
    _this = _super.call(this, source) || this;
    if (!source.complete && !!_this._width && !!_this._height) {
      _this._width = 0;
      _this._height = 0;
    }
    _this.url = source.src;
    _this._process = null;
    _this.preserveBitmap = false;
    _this.createBitmap = (options.createBitmap !== void 0 ? options.createBitmap : settings.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap;
    _this.alphaMode = typeof options.alphaMode === "number" ? options.alphaMode : null;
    _this.bitmap = null;
    _this._load = null;
    if (options.autoLoad !== false) {
      _this.load();
    }
    return _this;
  }
  ImageResource2.prototype.load = function(createBitmap) {
    var _this = this;
    if (this._load) {
      return this._load;
    }
    if (createBitmap !== void 0) {
      this.createBitmap = createBitmap;
    }
    this._load = new Promise(function(resolve2, reject) {
      var source = _this.source;
      _this.url = source.src;
      var completed = function() {
        if (_this.destroyed) {
          return;
        }
        source.onload = null;
        source.onerror = null;
        _this.resize(source.width, source.height);
        _this._load = null;
        if (_this.createBitmap) {
          resolve2(_this.process());
        } else {
          resolve2(_this);
        }
      };
      if (source.complete && source.src) {
        completed();
      } else {
        source.onload = completed;
        source.onerror = function(event) {
          reject(event);
          _this.onError.emit(event);
        };
      }
    });
    return this._load;
  };
  ImageResource2.prototype.process = function() {
    var _this = this;
    var source = this.source;
    if (this._process !== null) {
      return this._process;
    }
    if (this.bitmap !== null || !globalThis.createImageBitmap) {
      return Promise.resolve(this);
    }
    var createImageBitmap = globalThis.createImageBitmap;
    var cors = !source.crossOrigin || source.crossOrigin === "anonymous";
    this._process = fetch(source.src, {
      mode: cors ? "cors" : "no-cors"
    }).then(function(r2) {
      return r2.blob();
    }).then(function(blob) {
      return createImageBitmap(blob, 0, 0, source.width, source.height, {
        premultiplyAlpha: _this.alphaMode === ALPHA_MODES.UNPACK ? "premultiply" : "none"
      });
    }).then(function(bitmap) {
      if (_this.destroyed) {
        return Promise.reject();
      }
      _this.bitmap = bitmap;
      _this.update();
      _this._process = null;
      return Promise.resolve(_this);
    });
    return this._process;
  };
  ImageResource2.prototype.upload = function(renderer, baseTexture, glTexture) {
    if (typeof this.alphaMode === "number") {
      baseTexture.alphaMode = this.alphaMode;
    }
    if (!this.createBitmap) {
      return _super.prototype.upload.call(this, renderer, baseTexture, glTexture);
    }
    if (!this.bitmap) {
      this.process();
      if (!this.bitmap) {
        return false;
      }
    }
    _super.prototype.upload.call(this, renderer, baseTexture, glTexture, this.bitmap);
    if (!this.preserveBitmap) {
      var flag = true;
      var glTextures = baseTexture._glTextures;
      for (var key in glTextures) {
        var otherTex = glTextures[key];
        if (otherTex !== glTexture && otherTex.dirtyId !== baseTexture.dirtyId) {
          flag = false;
          break;
        }
      }
      if (flag) {
        if (this.bitmap.close) {
          this.bitmap.close();
        }
        this.bitmap = null;
      }
    }
    return true;
  };
  ImageResource2.prototype.dispose = function() {
    this.source.onload = null;
    this.source.onerror = null;
    _super.prototype.dispose.call(this);
    if (this.bitmap) {
      this.bitmap.close();
      this.bitmap = null;
    }
    this._process = null;
    this._load = null;
  };
  ImageResource2.test = function(source) {
    return typeof source === "string" || source instanceof HTMLImageElement;
  };
  return ImageResource2;
}(BaseImageResource);
var SVGResource = function(_super) {
  __extends(SVGResource2, _super);
  function SVGResource2(sourceBase64, options) {
    var _this = this;
    options = options || {};
    _this = _super.call(this, settings.ADAPTER.createCanvas()) || this;
    _this._width = 0;
    _this._height = 0;
    _this.svg = sourceBase64;
    _this.scale = options.scale || 1;
    _this._overrideWidth = options.width;
    _this._overrideHeight = options.height;
    _this._resolve = null;
    _this._crossorigin = options.crossorigin;
    _this._load = null;
    if (options.autoLoad !== false) {
      _this.load();
    }
    return _this;
  }
  SVGResource2.prototype.load = function() {
    var _this = this;
    if (this._load) {
      return this._load;
    }
    this._load = new Promise(function(resolve2) {
      _this._resolve = function() {
        _this.resize(_this.source.width, _this.source.height);
        resolve2(_this);
      };
      if (SVGResource2.SVG_XML.test(_this.svg.trim())) {
        if (!btoa) {
          throw new Error("Your browser doesn't support base64 conversions.");
        }
        _this.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(_this.svg)));
      }
      _this._loadSvg();
    });
    return this._load;
  };
  SVGResource2.prototype._loadSvg = function() {
    var _this = this;
    var tempImage = new Image();
    BaseImageResource.crossOrigin(tempImage, this.svg, this._crossorigin);
    tempImage.src = this.svg;
    tempImage.onerror = function(event) {
      if (!_this._resolve) {
        return;
      }
      tempImage.onerror = null;
      _this.onError.emit(event);
    };
    tempImage.onload = function() {
      if (!_this._resolve) {
        return;
      }
      var svgWidth = tempImage.width;
      var svgHeight = tempImage.height;
      if (!svgWidth || !svgHeight) {
        throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
      }
      var width = svgWidth * _this.scale;
      var height = svgHeight * _this.scale;
      if (_this._overrideWidth || _this._overrideHeight) {
        width = _this._overrideWidth || _this._overrideHeight / svgHeight * svgWidth;
        height = _this._overrideHeight || _this._overrideWidth / svgWidth * svgHeight;
      }
      width = Math.round(width);
      height = Math.round(height);
      var canvas = _this.source;
      canvas.width = width;
      canvas.height = height;
      canvas._pixiId = "canvas_" + uid();
      canvas.getContext("2d").drawImage(tempImage, 0, 0, svgWidth, svgHeight, 0, 0, width, height);
      _this._resolve();
      _this._resolve = null;
    };
  };
  SVGResource2.getSize = function(svgString) {
    var sizeMatch = SVGResource2.SVG_SIZE.exec(svgString);
    var size = {};
    if (sizeMatch) {
      size[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[3]));
      size[sizeMatch[5]] = Math.round(parseFloat(sizeMatch[7]));
    }
    return size;
  };
  SVGResource2.prototype.dispose = function() {
    _super.prototype.dispose.call(this);
    this._resolve = null;
    this._crossorigin = null;
  };
  SVGResource2.test = function(source, extension) {
    return extension === "svg" || typeof source === "string" && /^data:image\/svg\+xml(;(charset=utf8|utf8))?;base64/.test(source) || typeof source === "string" && SVGResource2.SVG_XML.test(source);
  };
  SVGResource2.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m;
  SVGResource2.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i;
  return SVGResource2;
}(BaseImageResource);
var VideoResource = function(_super) {
  __extends(VideoResource2, _super);
  function VideoResource2(source, options) {
    var _this = this;
    options = options || {};
    if (!(source instanceof HTMLVideoElement)) {
      var videoElement = document.createElement("video");
      videoElement.setAttribute("preload", "auto");
      videoElement.setAttribute("webkit-playsinline", "");
      videoElement.setAttribute("playsinline", "");
      if (typeof source === "string") {
        source = [source];
      }
      var firstSrc = source[0].src || source[0];
      BaseImageResource.crossOrigin(videoElement, firstSrc, options.crossorigin);
      for (var i = 0; i < source.length; ++i) {
        var sourceElement = document.createElement("source");
        var _a = source[i], src = _a.src, mime = _a.mime;
        src = src || source[i];
        var baseSrc = src.split("?").shift().toLowerCase();
        var ext = baseSrc.slice(baseSrc.lastIndexOf(".") + 1);
        mime = mime || VideoResource2.MIME_TYPES[ext] || "video/" + ext;
        sourceElement.src = src;
        sourceElement.type = mime;
        videoElement.appendChild(sourceElement);
      }
      source = videoElement;
    }
    _this = _super.call(this, source) || this;
    _this.noSubImage = true;
    _this._autoUpdate = true;
    _this._isConnectedToTicker = false;
    _this._updateFPS = options.updateFPS || 0;
    _this._msToNextUpdate = 0;
    _this.autoPlay = options.autoPlay !== false;
    _this._load = null;
    _this._resolve = null;
    _this._onCanPlay = _this._onCanPlay.bind(_this);
    _this._onError = _this._onError.bind(_this);
    if (options.autoLoad !== false) {
      _this.load();
    }
    return _this;
  }
  VideoResource2.prototype.update = function(_deltaTime) {
    if (!this.destroyed) {
      var elapsedMS = Ticker.shared.elapsedMS * this.source.playbackRate;
      this._msToNextUpdate = Math.floor(this._msToNextUpdate - elapsedMS);
      if (!this._updateFPS || this._msToNextUpdate <= 0) {
        _super.prototype.update.call(this);
        this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0;
      }
    }
  };
  VideoResource2.prototype.load = function() {
    var _this = this;
    if (this._load) {
      return this._load;
    }
    var source = this.source;
    if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height) {
      source.complete = true;
    }
    source.addEventListener("play", this._onPlayStart.bind(this));
    source.addEventListener("pause", this._onPlayStop.bind(this));
    if (!this._isSourceReady()) {
      source.addEventListener("canplay", this._onCanPlay);
      source.addEventListener("canplaythrough", this._onCanPlay);
      source.addEventListener("error", this._onError, true);
    } else {
      this._onCanPlay();
    }
    this._load = new Promise(function(resolve2) {
      if (_this.valid) {
        resolve2(_this);
      } else {
        _this._resolve = resolve2;
        source.load();
      }
    });
    return this._load;
  };
  VideoResource2.prototype._onError = function(event) {
    this.source.removeEventListener("error", this._onError, true);
    this.onError.emit(event);
  };
  VideoResource2.prototype._isSourcePlaying = function() {
    var source = this.source;
    return source.currentTime > 0 && source.paused === false && source.ended === false && source.readyState > 2;
  };
  VideoResource2.prototype._isSourceReady = function() {
    var source = this.source;
    return source.readyState === 3 || source.readyState === 4;
  };
  VideoResource2.prototype._onPlayStart = function() {
    if (!this.valid) {
      this._onCanPlay();
    }
    if (this.autoUpdate && !this._isConnectedToTicker) {
      Ticker.shared.add(this.update, this);
      this._isConnectedToTicker = true;
    }
  };
  VideoResource2.prototype._onPlayStop = function() {
    if (this._isConnectedToTicker) {
      Ticker.shared.remove(this.update, this);
      this._isConnectedToTicker = false;
    }
  };
  VideoResource2.prototype._onCanPlay = function() {
    var source = this.source;
    source.removeEventListener("canplay", this._onCanPlay);
    source.removeEventListener("canplaythrough", this._onCanPlay);
    var valid = this.valid;
    this.resize(source.videoWidth, source.videoHeight);
    if (!valid && this._resolve) {
      this._resolve(this);
      this._resolve = null;
    }
    if (this._isSourcePlaying()) {
      this._onPlayStart();
    } else if (this.autoPlay) {
      source.play();
    }
  };
  VideoResource2.prototype.dispose = function() {
    if (this._isConnectedToTicker) {
      Ticker.shared.remove(this.update, this);
      this._isConnectedToTicker = false;
    }
    var source = this.source;
    if (source) {
      source.removeEventListener("error", this._onError, true);
      source.pause();
      source.src = "";
      source.load();
    }
    _super.prototype.dispose.call(this);
  };
  Object.defineProperty(VideoResource2.prototype, "autoUpdate", {
    get: function() {
      return this._autoUpdate;
    },
    set: function(value) {
      if (value !== this._autoUpdate) {
        this._autoUpdate = value;
        if (!this._autoUpdate && this._isConnectedToTicker) {
          Ticker.shared.remove(this.update, this);
          this._isConnectedToTicker = false;
        } else if (this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying()) {
          Ticker.shared.add(this.update, this);
          this._isConnectedToTicker = true;
        }
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(VideoResource2.prototype, "updateFPS", {
    get: function() {
      return this._updateFPS;
    },
    set: function(value) {
      if (value !== this._updateFPS) {
        this._updateFPS = value;
      }
    },
    enumerable: false,
    configurable: true
  });
  VideoResource2.test = function(source, extension) {
    return globalThis.HTMLVideoElement && source instanceof HTMLVideoElement || VideoResource2.TYPES.indexOf(extension) > -1;
  };
  VideoResource2.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"];
  VideoResource2.MIME_TYPES = {
    ogv: "video/ogg",
    mov: "video/quicktime",
    m4v: "video/mp4"
  };
  return VideoResource2;
}(BaseImageResource);
var ImageBitmapResource = function(_super) {
  __extends(ImageBitmapResource2, _super);
  function ImageBitmapResource2(source) {
    return _super.call(this, source) || this;
  }
  ImageBitmapResource2.test = function(source) {
    return !!globalThis.createImageBitmap && typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap;
  };
  return ImageBitmapResource2;
}(BaseImageResource);
INSTALLED.push(ImageResource, ImageBitmapResource, CanvasResource, VideoResource, SVGResource, BufferResource, CubeResource, ArrayResource);
var DepthResource = function(_super) {
  __extends(DepthResource2, _super);
  function DepthResource2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  DepthResource2.prototype.upload = function(renderer, baseTexture, glTexture) {
    var gl = renderer.gl;
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
    var width = baseTexture.realWidth;
    var height = baseTexture.realHeight;
    if (glTexture.width === width && glTexture.height === height) {
      gl.texSubImage2D(baseTexture.target, 0, 0, 0, width, height, baseTexture.format, glTexture.type, this.data);
    } else {
      glTexture.width = width;
      glTexture.height = height;
      gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, width, height, 0, baseTexture.format, glTexture.type, this.data);
    }
    return true;
  };
  return DepthResource2;
}(BufferResource);
var Framebuffer = function() {
  function Framebuffer2(width, height) {
    this.width = Math.round(width || 100);
    this.height = Math.round(height || 100);
    this.stencil = false;
    this.depth = false;
    this.dirtyId = 0;
    this.dirtyFormat = 0;
    this.dirtySize = 0;
    this.depthTexture = null;
    this.colorTextures = [];
    this.glFramebuffers = {};
    this.disposeRunner = new Runner("disposeFramebuffer");
    this.multisample = MSAA_QUALITY.NONE;
  }
  Object.defineProperty(Framebuffer2.prototype, "colorTexture", {
    get: function() {
      return this.colorTextures[0];
    },
    enumerable: false,
    configurable: true
  });
  Framebuffer2.prototype.addColorTexture = function(index, texture) {
    if (index === void 0) {
      index = 0;
    }
    this.colorTextures[index] = texture || new BaseTexture(null, {
      scaleMode: SCALE_MODES.NEAREST,
      resolution: 1,
      mipmap: MIPMAP_MODES.OFF,
      width: this.width,
      height: this.height
    });
    this.dirtyId++;
    this.dirtyFormat++;
    return this;
  };
  Framebuffer2.prototype.addDepthTexture = function(texture) {
    this.depthTexture = texture || new BaseTexture(new DepthResource(null, { width: this.width, height: this.height }), {
      scaleMode: SCALE_MODES.NEAREST,
      resolution: 1,
      width: this.width,
      height: this.height,
      mipmap: MIPMAP_MODES.OFF,
      format: FORMATS.DEPTH_COMPONENT,
      type: TYPES.UNSIGNED_SHORT
    });
    this.dirtyId++;
    this.dirtyFormat++;
    return this;
  };
  Framebuffer2.prototype.enableDepth = function() {
    this.depth = true;
    this.dirtyId++;
    this.dirtyFormat++;
    return this;
  };
  Framebuffer2.prototype.enableStencil = function() {
    this.stencil = true;
    this.dirtyId++;
    this.dirtyFormat++;
    return this;
  };
  Framebuffer2.prototype.resize = function(width, height) {
    width = Math.round(width);
    height = Math.round(height);
    if (width === this.width && height === this.height) {
      return;
    }
    this.width = width;
    this.height = height;
    this.dirtyId++;
    this.dirtySize++;
    for (var i = 0; i < this.colorTextures.length; i++) {
      var texture = this.colorTextures[i];
      var resolution = texture.resolution;
      texture.setSize(width / resolution, height / resolution);
    }
    if (this.depthTexture) {
      var resolution = this.depthTexture.resolution;
      this.depthTexture.setSize(width / resolution, height / resolution);
    }
  };
  Framebuffer2.prototype.dispose = function() {
    this.disposeRunner.emit(this, false);
  };
  Framebuffer2.prototype.destroyDepthTexture = function() {
    if (this.depthTexture) {
      this.depthTexture.destroy();
      this.depthTexture = null;
      ++this.dirtyId;
      ++this.dirtyFormat;
    }
  };
  return Framebuffer2;
}();
var BaseRenderTexture = function(_super) {
  __extends(BaseRenderTexture2, _super);
  function BaseRenderTexture2(options) {
    if (options === void 0) {
      options = {};
    }
    var _this = this;
    if (typeof options === "number") {
      var width = arguments[0];
      var height = arguments[1];
      var scaleMode = arguments[2];
      var resolution = arguments[3];
      options = { width, height, scaleMode, resolution };
    }
    options.width = options.width || 100;
    options.height = options.height || 100;
    options.multisample = options.multisample !== void 0 ? options.multisample : MSAA_QUALITY.NONE;
    _this = _super.call(this, null, options) || this;
    _this.mipmap = MIPMAP_MODES.OFF;
    _this.valid = true;
    _this.clearColor = [0, 0, 0, 0];
    _this.framebuffer = new Framebuffer(_this.realWidth, _this.realHeight).addColorTexture(0, _this);
    _this.framebuffer.multisample = options.multisample;
    _this.maskStack = [];
    _this.filterStack = [{}];
    return _this;
  }
  BaseRenderTexture2.prototype.resize = function(desiredWidth, desiredHeight) {
    this.framebuffer.resize(desiredWidth * this.resolution, desiredHeight * this.resolution);
    this.setRealSize(this.framebuffer.width, this.framebuffer.height);
  };
  BaseRenderTexture2.prototype.dispose = function() {
    this.framebuffer.dispose();
    _super.prototype.dispose.call(this);
  };
  BaseRenderTexture2.prototype.destroy = function() {
    _super.prototype.destroy.call(this);
    this.framebuffer.destroyDepthTexture();
    this.framebuffer = null;
  };
  return BaseRenderTexture2;
}(BaseTexture);
var TextureUvs = function() {
  function TextureUvs2() {
    this.x0 = 0;
    this.y0 = 0;
    this.x1 = 1;
    this.y1 = 0;
    this.x2 = 1;
    this.y2 = 1;
    this.x3 = 0;
    this.y3 = 1;
    this.uvsFloat32 = new Float32Array(8);
  }
  TextureUvs2.prototype.set = function(frame, baseFrame, rotate) {
    var tw = baseFrame.width;
    var th = baseFrame.height;
    if (rotate) {
      var w2 = frame.width / 2 / tw;
      var h2 = frame.height / 2 / th;
      var cX = frame.x / tw + w2;
      var cY = frame.y / th + h2;
      rotate = groupD8.add(rotate, groupD8.NW);
      this.x0 = cX + w2 * groupD8.uX(rotate);
      this.y0 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      this.x1 = cX + w2 * groupD8.uX(rotate);
      this.y1 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      this.x2 = cX + w2 * groupD8.uX(rotate);
      this.y2 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      this.x3 = cX + w2 * groupD8.uX(rotate);
      this.y3 = cY + h2 * groupD8.uY(rotate);
    } else {
      this.x0 = frame.x / tw;
      this.y0 = frame.y / th;
      this.x1 = (frame.x + frame.width) / tw;
      this.y1 = frame.y / th;
      this.x2 = (frame.x + frame.width) / tw;
      this.y2 = (frame.y + frame.height) / th;
      this.x3 = frame.x / tw;
      this.y3 = (frame.y + frame.height) / th;
    }
    this.uvsFloat32[0] = this.x0;
    this.uvsFloat32[1] = this.y0;
    this.uvsFloat32[2] = this.x1;
    this.uvsFloat32[3] = this.y1;
    this.uvsFloat32[4] = this.x2;
    this.uvsFloat32[5] = this.y2;
    this.uvsFloat32[6] = this.x3;
    this.uvsFloat32[7] = this.y3;
  };
  TextureUvs2.prototype.toString = function() {
    return "[@pixi/core:TextureUvs " + ("x0=" + this.x0 + " y0=" + this.y0 + " ") + ("x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " ") + ("y2=" + this.y2 + " x3=" + this.x3 + " y3=" + this.y3) + "]";
  };
  return TextureUvs2;
}();
var DEFAULT_UVS = new TextureUvs();
function removeAllHandlers(tex) {
  tex.destroy = function _emptyDestroy() {
  };
  tex.on = function _emptyOn() {
  };
  tex.once = function _emptyOnce() {
  };
  tex.emit = function _emptyEmit() {
  };
}
var Texture = function(_super) {
  __extends(Texture2, _super);
  function Texture2(baseTexture, frame, orig, trim, rotate, anchor) {
    var _this = _super.call(this) || this;
    _this.noFrame = false;
    if (!frame) {
      _this.noFrame = true;
      frame = new Rectangle(0, 0, 1, 1);
    }
    if (baseTexture instanceof Texture2) {
      baseTexture = baseTexture.baseTexture;
    }
    _this.baseTexture = baseTexture;
    _this._frame = frame;
    _this.trim = trim;
    _this.valid = false;
    _this._uvs = DEFAULT_UVS;
    _this.uvMatrix = null;
    _this.orig = orig || frame;
    _this._rotate = Number(rotate || 0);
    if (rotate === true) {
      _this._rotate = 2;
    } else if (_this._rotate % 2 !== 0) {
      throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
    }
    _this.defaultAnchor = anchor ? new Point(anchor.x, anchor.y) : new Point(0, 0);
    _this._updateID = 0;
    _this.textureCacheIds = [];
    if (!baseTexture.valid) {
      baseTexture.once("loaded", _this.onBaseTextureUpdated, _this);
    } else if (_this.noFrame) {
      if (baseTexture.valid) {
        _this.onBaseTextureUpdated(baseTexture);
      }
    } else {
      _this.frame = frame;
    }
    if (_this.noFrame) {
      baseTexture.on("update", _this.onBaseTextureUpdated, _this);
    }
    return _this;
  }
  Texture2.prototype.update = function() {
    if (this.baseTexture.resource) {
      this.baseTexture.resource.update();
    }
  };
  Texture2.prototype.onBaseTextureUpdated = function(baseTexture) {
    if (this.noFrame) {
      if (!this.baseTexture.valid) {
        return;
      }
      this._frame.width = baseTexture.width;
      this._frame.height = baseTexture.height;
      this.valid = true;
      this.updateUvs();
    } else {
      this.frame = this._frame;
    }
    this.emit("update", this);
  };
  Texture2.prototype.destroy = function(destroyBase) {
    if (this.baseTexture) {
      if (destroyBase) {
        var resource = this.baseTexture.resource;
        if (resource && resource.url && TextureCache[resource.url]) {
          Texture2.removeFromCache(resource.url);
        }
        this.baseTexture.destroy();
      }
      this.baseTexture.off("loaded", this.onBaseTextureUpdated, this);
      this.baseTexture.off("update", this.onBaseTextureUpdated, this);
      this.baseTexture = null;
    }
    this._frame = null;
    this._uvs = null;
    this.trim = null;
    this.orig = null;
    this.valid = false;
    Texture2.removeFromCache(this);
    this.textureCacheIds = null;
  };
  Texture2.prototype.clone = function() {
    var clonedFrame = this._frame.clone();
    var clonedOrig = this._frame === this.orig ? clonedFrame : this.orig.clone();
    var clonedTexture = new Texture2(this.baseTexture, !this.noFrame && clonedFrame, clonedOrig, this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
    if (this.noFrame) {
      clonedTexture._frame = clonedFrame;
    }
    return clonedTexture;
  };
  Texture2.prototype.updateUvs = function() {
    if (this._uvs === DEFAULT_UVS) {
      this._uvs = new TextureUvs();
    }
    this._uvs.set(this._frame, this.baseTexture, this.rotate);
    this._updateID++;
  };
  Texture2.from = function(source, options, strict) {
    if (options === void 0) {
      options = {};
    }
    if (strict === void 0) {
      strict = settings.STRICT_TEXTURE_CACHE;
    }
    var isFrame = typeof source === "string";
    var cacheId = null;
    if (isFrame) {
      cacheId = source;
    } else if (source instanceof BaseTexture) {
      if (!source.cacheId) {
        var prefix = options && options.pixiIdPrefix || "pixiid";
        source.cacheId = prefix + "-" + uid();
        BaseTexture.addToCache(source, source.cacheId);
      }
      cacheId = source.cacheId;
    } else {
      if (!source._pixiId) {
        var prefix = options && options.pixiIdPrefix || "pixiid";
        source._pixiId = prefix + "_" + uid();
      }
      cacheId = source._pixiId;
    }
    var texture = TextureCache[cacheId];
    if (isFrame && strict && !texture) {
      throw new Error('The cacheId "' + cacheId + '" does not exist in TextureCache.');
    }
    if (!texture && !(source instanceof BaseTexture)) {
      if (!options.resolution) {
        options.resolution = getResolutionOfUrl(source);
      }
      texture = new Texture2(new BaseTexture(source, options));
      texture.baseTexture.cacheId = cacheId;
      BaseTexture.addToCache(texture.baseTexture, cacheId);
      Texture2.addToCache(texture, cacheId);
    } else if (!texture && source instanceof BaseTexture) {
      texture = new Texture2(source);
      Texture2.addToCache(texture, cacheId);
    }
    return texture;
  };
  Texture2.fromURL = function(url2, options) {
    var resourceOptions = Object.assign({ autoLoad: false }, options === null || options === void 0 ? void 0 : options.resourceOptions);
    var texture = Texture2.from(url2, Object.assign({ resourceOptions }, options), false);
    var resource = texture.baseTexture.resource;
    if (texture.baseTexture.valid) {
      return Promise.resolve(texture);
    }
    return resource.load().then(function() {
      return Promise.resolve(texture);
    });
  };
  Texture2.fromBuffer = function(buffer, width, height, options) {
    return new Texture2(BaseTexture.fromBuffer(buffer, width, height, options));
  };
  Texture2.fromLoader = function(source, imageUrl, name, options) {
    var baseTexture = new BaseTexture(source, Object.assign({
      scaleMode: settings.SCALE_MODE,
      resolution: getResolutionOfUrl(imageUrl)
    }, options));
    var resource = baseTexture.resource;
    if (resource instanceof ImageResource) {
      resource.url = imageUrl;
    }
    var texture = new Texture2(baseTexture);
    if (!name) {
      name = imageUrl;
    }
    BaseTexture.addToCache(texture.baseTexture, name);
    Texture2.addToCache(texture, name);
    if (name !== imageUrl) {
      BaseTexture.addToCache(texture.baseTexture, imageUrl);
      Texture2.addToCache(texture, imageUrl);
    }
    if (texture.baseTexture.valid) {
      return Promise.resolve(texture);
    }
    return new Promise(function(resolve2) {
      texture.baseTexture.once("loaded", function() {
        return resolve2(texture);
      });
    });
  };
  Texture2.addToCache = function(texture, id) {
    if (id) {
      if (texture.textureCacheIds.indexOf(id) === -1) {
        texture.textureCacheIds.push(id);
      }
      if (TextureCache[id]) {
        console.warn("Texture added to the cache with an id [" + id + "] that already had an entry");
      }
      TextureCache[id] = texture;
    }
  };
  Texture2.removeFromCache = function(texture) {
    if (typeof texture === "string") {
      var textureFromCache = TextureCache[texture];
      if (textureFromCache) {
        var index = textureFromCache.textureCacheIds.indexOf(texture);
        if (index > -1) {
          textureFromCache.textureCacheIds.splice(index, 1);
        }
        delete TextureCache[texture];
        return textureFromCache;
      }
    } else if (texture && texture.textureCacheIds) {
      for (var i = 0; i < texture.textureCacheIds.length; ++i) {
        if (TextureCache[texture.textureCacheIds[i]] === texture) {
          delete TextureCache[texture.textureCacheIds[i]];
        }
      }
      texture.textureCacheIds.length = 0;
      return texture;
    }
    return null;
  };
  Object.defineProperty(Texture2.prototype, "resolution", {
    get: function() {
      return this.baseTexture.resolution;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Texture2.prototype, "frame", {
    get: function() {
      return this._frame;
    },
    set: function(frame) {
      this._frame = frame;
      this.noFrame = false;
      var x2 = frame.x, y2 = frame.y, width = frame.width, height = frame.height;
      var xNotFit = x2 + width > this.baseTexture.width;
      var yNotFit = y2 + height > this.baseTexture.height;
      if (xNotFit || yNotFit) {
        var relationship = xNotFit && yNotFit ? "and" : "or";
        var errorX = "X: " + x2 + " + " + width + " = " + (x2 + width) + " > " + this.baseTexture.width;
        var errorY = "Y: " + y2 + " + " + height + " = " + (y2 + height) + " > " + this.baseTexture.height;
        throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + (errorX + " " + relationship + " " + errorY));
      }
      this.valid = width && height && this.baseTexture.valid;
      if (!this.trim && !this.rotate) {
        this.orig = frame;
      }
      if (this.valid) {
        this.updateUvs();
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Texture2.prototype, "rotate", {
    get: function() {
      return this._rotate;
    },
    set: function(rotate) {
      this._rotate = rotate;
      if (this.valid) {
        this.updateUvs();
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Texture2.prototype, "width", {
    get: function() {
      return this.orig.width;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Texture2.prototype, "height", {
    get: function() {
      return this.orig.height;
    },
    enumerable: false,
    configurable: true
  });
  Texture2.prototype.castToBaseTexture = function() {
    return this.baseTexture;
  };
  Object.defineProperty(Texture2, "EMPTY", {
    get: function() {
      if (!Texture2._EMPTY) {
        Texture2._EMPTY = new Texture2(new BaseTexture());
        removeAllHandlers(Texture2._EMPTY);
        removeAllHandlers(Texture2._EMPTY.baseTexture);
      }
      return Texture2._EMPTY;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Texture2, "WHITE", {
    get: function() {
      if (!Texture2._WHITE) {
        var canvas = settings.ADAPTER.createCanvas(16, 16);
        var context2 = canvas.getContext("2d");
        canvas.width = 16;
        canvas.height = 16;
        context2.fillStyle = "white";
        context2.fillRect(0, 0, 16, 16);
        Texture2._WHITE = new Texture2(BaseTexture.from(canvas));
        removeAllHandlers(Texture2._WHITE);
        removeAllHandlers(Texture2._WHITE.baseTexture);
      }
      return Texture2._WHITE;
    },
    enumerable: false,
    configurable: true
  });
  return Texture2;
}(n);
var RenderTexture = function(_super) {
  __extends(RenderTexture2, _super);
  function RenderTexture2(baseRenderTexture, frame) {
    var _this = _super.call(this, baseRenderTexture, frame) || this;
    _this.valid = true;
    _this.filterFrame = null;
    _this.filterPoolKey = null;
    _this.updateUvs();
    return _this;
  }
  Object.defineProperty(RenderTexture2.prototype, "framebuffer", {
    get: function() {
      return this.baseTexture.framebuffer;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(RenderTexture2.prototype, "multisample", {
    get: function() {
      return this.framebuffer.multisample;
    },
    set: function(value) {
      this.framebuffer.multisample = value;
    },
    enumerable: false,
    configurable: true
  });
  RenderTexture2.prototype.resize = function(desiredWidth, desiredHeight, resizeBaseTexture) {
    if (resizeBaseTexture === void 0) {
      resizeBaseTexture = true;
    }
    var resolution = this.baseTexture.resolution;
    var width = Math.round(desiredWidth * resolution) / resolution;
    var height = Math.round(desiredHeight * resolution) / resolution;
    this.valid = width > 0 && height > 0;
    this._frame.width = this.orig.width = width;
    this._frame.height = this.orig.height = height;
    if (resizeBaseTexture) {
      this.baseTexture.resize(width, height);
    }
    this.updateUvs();
  };
  RenderTexture2.prototype.setResolution = function(resolution) {
    var baseTexture = this.baseTexture;
    if (baseTexture.resolution === resolution) {
      return;
    }
    baseTexture.setResolution(resolution);
    this.resize(baseTexture.width, baseTexture.height, false);
  };
  RenderTexture2.create = function(options) {
    var arguments$1 = arguments;
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      rest[_i - 1] = arguments$1[_i];
    }
    if (typeof options === "number") {
      deprecation("6.0.0", "Arguments (width, height, scaleMode, resolution) have been deprecated.");
      options = {
        width: options,
        height: rest[0],
        scaleMode: rest[1],
        resolution: rest[2]
      };
    }
    return new RenderTexture2(new BaseRenderTexture(options));
  };
  return RenderTexture2;
}(Texture);
var RenderTexturePool = function() {
  function RenderTexturePool2(textureOptions) {
    this.texturePool = {};
    this.textureOptions = textureOptions || {};
    this.enableFullScreen = false;
    this._pixelsWidth = 0;
    this._pixelsHeight = 0;
  }
  RenderTexturePool2.prototype.createTexture = function(realWidth, realHeight, multisample) {
    if (multisample === void 0) {
      multisample = MSAA_QUALITY.NONE;
    }
    var baseRenderTexture = new BaseRenderTexture(Object.assign({
      width: realWidth,
      height: realHeight,
      resolution: 1,
      multisample
    }, this.textureOptions));
    return new RenderTexture(baseRenderTexture);
  };
  RenderTexturePool2.prototype.getOptimalTexture = function(minWidth, minHeight, resolution, multisample) {
    if (resolution === void 0) {
      resolution = 1;
    }
    if (multisample === void 0) {
      multisample = MSAA_QUALITY.NONE;
    }
    var key;
    minWidth = Math.ceil(minWidth * resolution - 1e-6);
    minHeight = Math.ceil(minHeight * resolution - 1e-6);
    if (!this.enableFullScreen || minWidth !== this._pixelsWidth || minHeight !== this._pixelsHeight) {
      minWidth = nextPow2(minWidth);
      minHeight = nextPow2(minHeight);
      key = ((minWidth & 65535) << 16 | minHeight & 65535) >>> 0;
      if (multisample > 1) {
        key += multisample * 4294967296;
      }
    } else {
      key = multisample > 1 ? -multisample : -1;
    }
    if (!this.texturePool[key]) {
      this.texturePool[key] = [];
    }
    var renderTexture = this.texturePool[key].pop();
    if (!renderTexture) {
      renderTexture = this.createTexture(minWidth, minHeight, multisample);
    }
    renderTexture.filterPoolKey = key;
    renderTexture.setResolution(resolution);
    return renderTexture;
  };
  RenderTexturePool2.prototype.getFilterTexture = function(input, resolution, multisample) {
    var filterTexture = this.getOptimalTexture(input.width, input.height, resolution || input.resolution, multisample || MSAA_QUALITY.NONE);
    filterTexture.filterFrame = input.filterFrame;
    return filterTexture;
  };
  RenderTexturePool2.prototype.returnTexture = function(renderTexture) {
    var key = renderTexture.filterPoolKey;
    renderTexture.filterFrame = null;
    this.texturePool[key].push(renderTexture);
  };
  RenderTexturePool2.prototype.returnFilterTexture = function(renderTexture) {
    this.returnTexture(renderTexture);
  };
  RenderTexturePool2.prototype.clear = function(destroyTextures) {
    destroyTextures = destroyTextures !== false;
    if (destroyTextures) {
      for (var i in this.texturePool) {
        var textures = this.texturePool[i];
        if (textures) {
          for (var j2 = 0; j2 < textures.length; j2++) {
            textures[j2].destroy(true);
          }
        }
      }
    }
    this.texturePool = {};
  };
  RenderTexturePool2.prototype.setScreenSize = function(size) {
    if (size.width === this._pixelsWidth && size.height === this._pixelsHeight) {
      return;
    }
    this.enableFullScreen = size.width > 0 && size.height > 0;
    for (var i in this.texturePool) {
      if (!(Number(i) < 0)) {
        continue;
      }
      var textures = this.texturePool[i];
      if (textures) {
        for (var j2 = 0; j2 < textures.length; j2++) {
          textures[j2].destroy(true);
        }
      }
      this.texturePool[i] = [];
    }
    this._pixelsWidth = size.width;
    this._pixelsHeight = size.height;
  };
  RenderTexturePool2.SCREEN_KEY = -1;
  return RenderTexturePool2;
}();
var Attribute = function() {
  function Attribute2(buffer, size, normalized, type, stride, start, instance) {
    if (size === void 0) {
      size = 0;
    }
    if (normalized === void 0) {
      normalized = false;
    }
    if (type === void 0) {
      type = TYPES.FLOAT;
    }
    this.buffer = buffer;
    this.size = size;
    this.normalized = normalized;
    this.type = type;
    this.stride = stride;
    this.start = start;
    this.instance = instance;
  }
  Attribute2.prototype.destroy = function() {
    this.buffer = null;
  };
  Attribute2.from = function(buffer, size, normalized, type, stride) {
    return new Attribute2(buffer, size, normalized, type, stride);
  };
  return Attribute2;
}();
var UID$4 = 0;
var Buffer2 = function() {
  function Buffer3(data, _static, index) {
    if (_static === void 0) {
      _static = true;
    }
    if (index === void 0) {
      index = false;
    }
    this.data = data || new Float32Array(1);
    this._glBuffers = {};
    this._updateID = 0;
    this.index = index;
    this.static = _static;
    this.id = UID$4++;
    this.disposeRunner = new Runner("disposeBuffer");
  }
  Buffer3.prototype.update = function(data) {
    if (data instanceof Array) {
      data = new Float32Array(data);
    }
    this.data = data || this.data;
    this._updateID++;
  };
  Buffer3.prototype.dispose = function() {
    this.disposeRunner.emit(this, false);
  };
  Buffer3.prototype.destroy = function() {
    this.dispose();
    this.data = null;
  };
  Object.defineProperty(Buffer3.prototype, "index", {
    get: function() {
      return this.type === BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
    },
    set: function(value) {
      this.type = value ? BUFFER_TYPE.ELEMENT_ARRAY_BUFFER : BUFFER_TYPE.ARRAY_BUFFER;
    },
    enumerable: false,
    configurable: true
  });
  Buffer3.from = function(data) {
    if (data instanceof Array) {
      data = new Float32Array(data);
    }
    return new Buffer3(data);
  };
  return Buffer3;
}();
var map$1 = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array
};
function interleaveTypedArrays(arrays, sizes) {
  var outSize = 0;
  var stride = 0;
  var views = {};
  for (var i = 0; i < arrays.length; i++) {
    stride += sizes[i];
    outSize += arrays[i].length;
  }
  var buffer = new ArrayBuffer(outSize * 4);
  var out = null;
  var littleOffset = 0;
  for (var i = 0; i < arrays.length; i++) {
    var size = sizes[i];
    var array = arrays[i];
    var type = getBufferType(array);
    if (!views[type]) {
      views[type] = new map$1[type](buffer);
    }
    out = views[type];
    for (var j2 = 0; j2 < array.length; j2++) {
      var indexStart = (j2 / size | 0) * stride + littleOffset;
      var index = j2 % size;
      out[indexStart + index] = array[j2];
    }
    littleOffset += size;
  }
  return new Float32Array(buffer);
}
var byteSizeMap$1 = { 5126: 4, 5123: 2, 5121: 1 };
var UID$3 = 0;
var map$2 = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array,
  Uint16Array
};
var Geometry = function() {
  function Geometry2(buffers, attributes) {
    if (buffers === void 0) {
      buffers = [];
    }
    if (attributes === void 0) {
      attributes = {};
    }
    this.buffers = buffers;
    this.indexBuffer = null;
    this.attributes = attributes;
    this.glVertexArrayObjects = {};
    this.id = UID$3++;
    this.instanced = false;
    this.instanceCount = 1;
    this.disposeRunner = new Runner("disposeGeometry");
    this.refCount = 0;
  }
  Geometry2.prototype.addAttribute = function(id, buffer, size, normalized, type, stride, start, instance) {
    if (size === void 0) {
      size = 0;
    }
    if (normalized === void 0) {
      normalized = false;
    }
    if (instance === void 0) {
      instance = false;
    }
    if (!buffer) {
      throw new Error("You must pass a buffer when creating an attribute");
    }
    if (!(buffer instanceof Buffer2)) {
      if (buffer instanceof Array) {
        buffer = new Float32Array(buffer);
      }
      buffer = new Buffer2(buffer);
    }
    var ids = id.split("|");
    if (ids.length > 1) {
      for (var i = 0; i < ids.length; i++) {
        this.addAttribute(ids[i], buffer, size, normalized, type);
      }
      return this;
    }
    var bufferIndex = this.buffers.indexOf(buffer);
    if (bufferIndex === -1) {
      this.buffers.push(buffer);
      bufferIndex = this.buffers.length - 1;
    }
    this.attributes[id] = new Attribute(bufferIndex, size, normalized, type, stride, start, instance);
    this.instanced = this.instanced || instance;
    return this;
  };
  Geometry2.prototype.getAttribute = function(id) {
    return this.attributes[id];
  };
  Geometry2.prototype.getBuffer = function(id) {
    return this.buffers[this.getAttribute(id).buffer];
  };
  Geometry2.prototype.addIndex = function(buffer) {
    if (!(buffer instanceof Buffer2)) {
      if (buffer instanceof Array) {
        buffer = new Uint16Array(buffer);
      }
      buffer = new Buffer2(buffer);
    }
    buffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
    this.indexBuffer = buffer;
    if (this.buffers.indexOf(buffer) === -1) {
      this.buffers.push(buffer);
    }
    return this;
  };
  Geometry2.prototype.getIndex = function() {
    return this.indexBuffer;
  };
  Geometry2.prototype.interleave = function() {
    if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer) {
      return this;
    }
    var arrays = [];
    var sizes = [];
    var interleavedBuffer = new Buffer2();
    var i;
    for (i in this.attributes) {
      var attribute = this.attributes[i];
      var buffer = this.buffers[attribute.buffer];
      arrays.push(buffer.data);
      sizes.push(attribute.size * byteSizeMap$1[attribute.type] / 4);
      attribute.buffer = 0;
    }
    interleavedBuffer.data = interleaveTypedArrays(arrays, sizes);
    for (i = 0; i < this.buffers.length; i++) {
      if (this.buffers[i] !== this.indexBuffer) {
        this.buffers[i].destroy();
      }
    }
    this.buffers = [interleavedBuffer];
    if (this.indexBuffer) {
      this.buffers.push(this.indexBuffer);
    }
    return this;
  };
  Geometry2.prototype.getSize = function() {
    for (var i in this.attributes) {
      var attribute = this.attributes[i];
      var buffer = this.buffers[attribute.buffer];
      return buffer.data.length / (attribute.stride / 4 || attribute.size);
    }
    return 0;
  };
  Geometry2.prototype.dispose = function() {
    this.disposeRunner.emit(this, false);
  };
  Geometry2.prototype.destroy = function() {
    this.dispose();
    this.buffers = null;
    this.indexBuffer = null;
    this.attributes = null;
  };
  Geometry2.prototype.clone = function() {
    var geometry = new Geometry2();
    for (var i = 0; i < this.buffers.length; i++) {
      geometry.buffers[i] = new Buffer2(this.buffers[i].data.slice(0));
    }
    for (var i in this.attributes) {
      var attrib = this.attributes[i];
      geometry.attributes[i] = new Attribute(attrib.buffer, attrib.size, attrib.normalized, attrib.type, attrib.stride, attrib.start, attrib.instance);
    }
    if (this.indexBuffer) {
      geometry.indexBuffer = geometry.buffers[this.buffers.indexOf(this.indexBuffer)];
      geometry.indexBuffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
    }
    return geometry;
  };
  Geometry2.merge = function(geometries) {
    var geometryOut = new Geometry2();
    var arrays = [];
    var sizes = [];
    var offsets = [];
    var geometry;
    for (var i = 0; i < geometries.length; i++) {
      geometry = geometries[i];
      for (var j2 = 0; j2 < geometry.buffers.length; j2++) {
        sizes[j2] = sizes[j2] || 0;
        sizes[j2] += geometry.buffers[j2].data.length;
        offsets[j2] = 0;
      }
    }
    for (var i = 0; i < geometry.buffers.length; i++) {
      arrays[i] = new map$2[getBufferType(geometry.buffers[i].data)](sizes[i]);
      geometryOut.buffers[i] = new Buffer2(arrays[i]);
    }
    for (var i = 0; i < geometries.length; i++) {
      geometry = geometries[i];
      for (var j2 = 0; j2 < geometry.buffers.length; j2++) {
        arrays[j2].set(geometry.buffers[j2].data, offsets[j2]);
        offsets[j2] += geometry.buffers[j2].data.length;
      }
    }
    geometryOut.attributes = geometry.attributes;
    if (geometry.indexBuffer) {
      geometryOut.indexBuffer = geometryOut.buffers[geometry.buffers.indexOf(geometry.indexBuffer)];
      geometryOut.indexBuffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
      var offset = 0;
      var stride = 0;
      var offset2 = 0;
      var bufferIndexToCount = 0;
      for (var i = 0; i < geometry.buffers.length; i++) {
        if (geometry.buffers[i] !== geometry.indexBuffer) {
          bufferIndexToCount = i;
          break;
        }
      }
      for (var i in geometry.attributes) {
        var attribute = geometry.attributes[i];
        if ((attribute.buffer | 0) === bufferIndexToCount) {
          stride += attribute.size * byteSizeMap$1[attribute.type] / 4;
        }
      }
      for (var i = 0; i < geometries.length; i++) {
        var indexBufferData = geometries[i].indexBuffer.data;
        for (var j2 = 0; j2 < indexBufferData.length; j2++) {
          geometryOut.indexBuffer.data[j2 + offset2] += offset;
        }
        offset += geometries[i].buffers[bufferIndexToCount].data.length / stride;
        offset2 += indexBufferData.length;
      }
    }
    return geometryOut;
  };
  return Geometry2;
}();
var Quad = function(_super) {
  __extends(Quad2, _super);
  function Quad2() {
    var _this = _super.call(this) || this;
    _this.addAttribute("aVertexPosition", new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ])).addIndex([0, 1, 3, 2]);
    return _this;
  }
  return Quad2;
}(Geometry);
var QuadUv = function(_super) {
  __extends(QuadUv2, _super);
  function QuadUv2() {
    var _this = _super.call(this) || this;
    _this.vertices = new Float32Array([
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1
    ]);
    _this.uvs = new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ]);
    _this.vertexBuffer = new Buffer2(_this.vertices);
    _this.uvBuffer = new Buffer2(_this.uvs);
    _this.addAttribute("aVertexPosition", _this.vertexBuffer).addAttribute("aTextureCoord", _this.uvBuffer).addIndex([0, 1, 2, 0, 2, 3]);
    return _this;
  }
  QuadUv2.prototype.map = function(targetTextureFrame, destinationFrame) {
    var x2 = 0;
    var y2 = 0;
    this.uvs[0] = x2;
    this.uvs[1] = y2;
    this.uvs[2] = x2 + destinationFrame.width / targetTextureFrame.width;
    this.uvs[3] = y2;
    this.uvs[4] = x2 + destinationFrame.width / targetTextureFrame.width;
    this.uvs[5] = y2 + destinationFrame.height / targetTextureFrame.height;
    this.uvs[6] = x2;
    this.uvs[7] = y2 + destinationFrame.height / targetTextureFrame.height;
    x2 = destinationFrame.x;
    y2 = destinationFrame.y;
    this.vertices[0] = x2;
    this.vertices[1] = y2;
    this.vertices[2] = x2 + destinationFrame.width;
    this.vertices[3] = y2;
    this.vertices[4] = x2 + destinationFrame.width;
    this.vertices[5] = y2 + destinationFrame.height;
    this.vertices[6] = x2;
    this.vertices[7] = y2 + destinationFrame.height;
    this.invalidate();
    return this;
  };
  QuadUv2.prototype.invalidate = function() {
    this.vertexBuffer._updateID++;
    this.uvBuffer._updateID++;
    return this;
  };
  return QuadUv2;
}(Geometry);
var UID$2 = 0;
var UniformGroup = function() {
  function UniformGroup2(uniforms, isStatic, isUbo) {
    this.group = true;
    this.syncUniforms = {};
    this.dirtyId = 0;
    this.id = UID$2++;
    this.static = !!isStatic;
    this.ubo = !!isUbo;
    if (uniforms instanceof Buffer2) {
      this.buffer = uniforms;
      this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER;
      this.autoManage = false;
      this.ubo = true;
    } else {
      this.uniforms = uniforms;
      if (this.ubo) {
        this.buffer = new Buffer2(new Float32Array(1));
        this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER;
        this.autoManage = true;
      }
    }
  }
  UniformGroup2.prototype.update = function() {
    this.dirtyId++;
    if (!this.autoManage && this.buffer) {
      this.buffer.update();
    }
  };
  UniformGroup2.prototype.add = function(name, uniforms, _static) {
    if (!this.ubo) {
      this.uniforms[name] = new UniformGroup2(uniforms, _static);
    } else {
      throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
    }
  };
  UniformGroup2.from = function(uniforms, _static, _ubo) {
    return new UniformGroup2(uniforms, _static, _ubo);
  };
  UniformGroup2.uboFrom = function(uniforms, _static) {
    return new UniformGroup2(uniforms, _static !== null && _static !== void 0 ? _static : true, true);
  };
  return UniformGroup2;
}();
var FilterState = function() {
  function FilterState2() {
    this.renderTexture = null;
    this.target = null;
    this.legacy = false;
    this.resolution = 1;
    this.multisample = MSAA_QUALITY.NONE;
    this.sourceFrame = new Rectangle();
    this.destinationFrame = new Rectangle();
    this.bindingSourceFrame = new Rectangle();
    this.bindingDestinationFrame = new Rectangle();
    this.filters = [];
    this.transform = null;
  }
  FilterState2.prototype.clear = function() {
    this.target = null;
    this.filters = null;
    this.renderTexture = null;
  };
  return FilterState2;
}();
var tempPoints = [new Point(), new Point(), new Point(), new Point()];
var tempMatrix$2 = new Matrix();
var FilterSystem = function() {
  function FilterSystem2(renderer) {
    this.renderer = renderer;
    this.defaultFilterStack = [{}];
    this.texturePool = new RenderTexturePool();
    this.texturePool.setScreenSize(renderer.view);
    this.statePool = [];
    this.quad = new Quad();
    this.quadUv = new QuadUv();
    this.tempRect = new Rectangle();
    this.activeState = {};
    this.globalUniforms = new UniformGroup({
      outputFrame: new Rectangle(),
      inputSize: new Float32Array(4),
      inputPixel: new Float32Array(4),
      inputClamp: new Float32Array(4),
      resolution: 1,
      filterArea: new Float32Array(4),
      filterClamp: new Float32Array(4)
    }, true);
    this.forceClear = false;
    this.useMaxPadding = false;
  }
  FilterSystem2.prototype.push = function(target, filters) {
    var _a, _b;
    var renderer = this.renderer;
    var filterStack = this.defaultFilterStack;
    var state = this.statePool.pop() || new FilterState();
    var renderTextureSystem = this.renderer.renderTexture;
    var resolution = filters[0].resolution;
    var multisample = filters[0].multisample;
    var padding = filters[0].padding;
    var autoFit = filters[0].autoFit;
    var legacy = (_a = filters[0].legacy) !== null && _a !== void 0 ? _a : true;
    for (var i = 1; i < filters.length; i++) {
      var filter = filters[i];
      resolution = Math.min(resolution, filter.resolution);
      multisample = Math.min(multisample, filter.multisample);
      padding = this.useMaxPadding ? Math.max(padding, filter.padding) : padding + filter.padding;
      autoFit = autoFit && filter.autoFit;
      legacy = legacy || ((_b = filter.legacy) !== null && _b !== void 0 ? _b : true);
    }
    if (filterStack.length === 1) {
      this.defaultFilterStack[0].renderTexture = renderTextureSystem.current;
    }
    filterStack.push(state);
    state.resolution = resolution;
    state.multisample = multisample;
    state.legacy = legacy;
    state.target = target;
    state.sourceFrame.copyFrom(target.filterArea || target.getBounds(true));
    state.sourceFrame.pad(padding);
    var sourceFrameProjected = this.tempRect.copyFrom(renderTextureSystem.sourceFrame);
    if (renderer.projection.transform) {
      this.transformAABB(tempMatrix$2.copyFrom(renderer.projection.transform).invert(), sourceFrameProjected);
    }
    if (autoFit) {
      state.sourceFrame.fit(sourceFrameProjected);
      if (state.sourceFrame.width <= 0 || state.sourceFrame.height <= 0) {
        state.sourceFrame.width = 0;
        state.sourceFrame.height = 0;
      }
    } else if (!state.sourceFrame.intersects(sourceFrameProjected)) {
      state.sourceFrame.width = 0;
      state.sourceFrame.height = 0;
    }
    this.roundFrame(state.sourceFrame, renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution, renderTextureSystem.sourceFrame, renderTextureSystem.destinationFrame, renderer.projection.transform);
    state.renderTexture = this.getOptimalFilterTexture(state.sourceFrame.width, state.sourceFrame.height, resolution, multisample);
    state.filters = filters;
    state.destinationFrame.width = state.renderTexture.width;
    state.destinationFrame.height = state.renderTexture.height;
    var destinationFrame = this.tempRect;
    destinationFrame.x = 0;
    destinationFrame.y = 0;
    destinationFrame.width = state.sourceFrame.width;
    destinationFrame.height = state.sourceFrame.height;
    state.renderTexture.filterFrame = state.sourceFrame;
    state.bindingSourceFrame.copyFrom(renderTextureSystem.sourceFrame);
    state.bindingDestinationFrame.copyFrom(renderTextureSystem.destinationFrame);
    state.transform = renderer.projection.transform;
    renderer.projection.transform = null;
    renderTextureSystem.bind(state.renderTexture, state.sourceFrame, destinationFrame);
    renderer.framebuffer.clear(0, 0, 0, 0);
  };
  FilterSystem2.prototype.pop = function() {
    var filterStack = this.defaultFilterStack;
    var state = filterStack.pop();
    var filters = state.filters;
    this.activeState = state;
    var globalUniforms = this.globalUniforms.uniforms;
    globalUniforms.outputFrame = state.sourceFrame;
    globalUniforms.resolution = state.resolution;
    var inputSize = globalUniforms.inputSize;
    var inputPixel = globalUniforms.inputPixel;
    var inputClamp = globalUniforms.inputClamp;
    inputSize[0] = state.destinationFrame.width;
    inputSize[1] = state.destinationFrame.height;
    inputSize[2] = 1 / inputSize[0];
    inputSize[3] = 1 / inputSize[1];
    inputPixel[0] = Math.round(inputSize[0] * state.resolution);
    inputPixel[1] = Math.round(inputSize[1] * state.resolution);
    inputPixel[2] = 1 / inputPixel[0];
    inputPixel[3] = 1 / inputPixel[1];
    inputClamp[0] = 0.5 * inputPixel[2];
    inputClamp[1] = 0.5 * inputPixel[3];
    inputClamp[2] = state.sourceFrame.width * inputSize[2] - 0.5 * inputPixel[2];
    inputClamp[3] = state.sourceFrame.height * inputSize[3] - 0.5 * inputPixel[3];
    if (state.legacy) {
      var filterArea = globalUniforms.filterArea;
      filterArea[0] = state.destinationFrame.width;
      filterArea[1] = state.destinationFrame.height;
      filterArea[2] = state.sourceFrame.x;
      filterArea[3] = state.sourceFrame.y;
      globalUniforms.filterClamp = globalUniforms.inputClamp;
    }
    this.globalUniforms.update();
    var lastState = filterStack[filterStack.length - 1];
    this.renderer.framebuffer.blit();
    if (filters.length === 1) {
      filters[0].apply(this, state.renderTexture, lastState.renderTexture, CLEAR_MODES.BLEND, state);
      this.returnFilterTexture(state.renderTexture);
    } else {
      var flip = state.renderTexture;
      var flop = this.getOptimalFilterTexture(flip.width, flip.height, state.resolution);
      flop.filterFrame = flip.filterFrame;
      var i = 0;
      for (i = 0; i < filters.length - 1; ++i) {
        if (i === 1 && state.multisample > 1) {
          flop = this.getOptimalFilterTexture(flip.width, flip.height, state.resolution);
          flop.filterFrame = flip.filterFrame;
        }
        filters[i].apply(this, flip, flop, CLEAR_MODES.CLEAR, state);
        var t = flip;
        flip = flop;
        flop = t;
      }
      filters[i].apply(this, flip, lastState.renderTexture, CLEAR_MODES.BLEND, state);
      if (i > 1 && state.multisample > 1) {
        this.returnFilterTexture(state.renderTexture);
      }
      this.returnFilterTexture(flip);
      this.returnFilterTexture(flop);
    }
    state.clear();
    this.statePool.push(state);
  };
  FilterSystem2.prototype.bindAndClear = function(filterTexture, clearMode) {
    if (clearMode === void 0) {
      clearMode = CLEAR_MODES.CLEAR;
    }
    var _a = this.renderer, renderTextureSystem = _a.renderTexture, stateSystem = _a.state;
    if (filterTexture === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture) {
      this.renderer.projection.transform = this.activeState.transform;
    } else {
      this.renderer.projection.transform = null;
    }
    if (filterTexture && filterTexture.filterFrame) {
      var destinationFrame = this.tempRect;
      destinationFrame.x = 0;
      destinationFrame.y = 0;
      destinationFrame.width = filterTexture.filterFrame.width;
      destinationFrame.height = filterTexture.filterFrame.height;
      renderTextureSystem.bind(filterTexture, filterTexture.filterFrame, destinationFrame);
    } else if (filterTexture !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture) {
      renderTextureSystem.bind(filterTexture);
    } else {
      this.renderer.renderTexture.bind(filterTexture, this.activeState.bindingSourceFrame, this.activeState.bindingDestinationFrame);
    }
    var autoClear = stateSystem.stateId & 1 || this.forceClear;
    if (clearMode === CLEAR_MODES.CLEAR || clearMode === CLEAR_MODES.BLIT && autoClear) {
      this.renderer.framebuffer.clear(0, 0, 0, 0);
    }
  };
  FilterSystem2.prototype.applyFilter = function(filter, input, output, clearMode) {
    var renderer = this.renderer;
    renderer.state.set(filter.state);
    this.bindAndClear(output, clearMode);
    filter.uniforms.uSampler = input;
    filter.uniforms.filterGlobals = this.globalUniforms;
    renderer.shader.bind(filter);
    filter.legacy = !!filter.program.attributeData.aTextureCoord;
    if (filter.legacy) {
      this.quadUv.map(input._frame, input.filterFrame);
      renderer.geometry.bind(this.quadUv);
      renderer.geometry.draw(DRAW_MODES.TRIANGLES);
    } else {
      renderer.geometry.bind(this.quad);
      renderer.geometry.draw(DRAW_MODES.TRIANGLE_STRIP);
    }
  };
  FilterSystem2.prototype.calculateSpriteMatrix = function(outputMatrix, sprite) {
    var _a = this.activeState, sourceFrame = _a.sourceFrame, destinationFrame = _a.destinationFrame;
    var orig = sprite._texture.orig;
    var mappedMatrix = outputMatrix.set(destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);
    var worldTransform = sprite.worldTransform.copyTo(Matrix.TEMP_MATRIX);
    worldTransform.invert();
    mappedMatrix.prepend(worldTransform);
    mappedMatrix.scale(1 / orig.width, 1 / orig.height);
    mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);
    return mappedMatrix;
  };
  FilterSystem2.prototype.destroy = function() {
    this.renderer = null;
    this.texturePool.clear(false);
  };
  FilterSystem2.prototype.getOptimalFilterTexture = function(minWidth, minHeight, resolution, multisample) {
    if (resolution === void 0) {
      resolution = 1;
    }
    if (multisample === void 0) {
      multisample = MSAA_QUALITY.NONE;
    }
    return this.texturePool.getOptimalTexture(minWidth, minHeight, resolution, multisample);
  };
  FilterSystem2.prototype.getFilterTexture = function(input, resolution, multisample) {
    if (typeof input === "number") {
      var swap = input;
      input = resolution;
      resolution = swap;
    }
    input = input || this.activeState.renderTexture;
    var filterTexture = this.texturePool.getOptimalTexture(input.width, input.height, resolution || input.resolution, multisample || MSAA_QUALITY.NONE);
    filterTexture.filterFrame = input.filterFrame;
    return filterTexture;
  };
  FilterSystem2.prototype.returnFilterTexture = function(renderTexture) {
    this.texturePool.returnTexture(renderTexture);
  };
  FilterSystem2.prototype.emptyPool = function() {
    this.texturePool.clear(true);
  };
  FilterSystem2.prototype.resize = function() {
    this.texturePool.setScreenSize(this.renderer.view);
  };
  FilterSystem2.prototype.transformAABB = function(matrix, rect) {
    var lt = tempPoints[0];
    var lb = tempPoints[1];
    var rt = tempPoints[2];
    var rb = tempPoints[3];
    lt.set(rect.left, rect.top);
    lb.set(rect.left, rect.bottom);
    rt.set(rect.right, rect.top);
    rb.set(rect.right, rect.bottom);
    matrix.apply(lt, lt);
    matrix.apply(lb, lb);
    matrix.apply(rt, rt);
    matrix.apply(rb, rb);
    var x0 = Math.min(lt.x, lb.x, rt.x, rb.x);
    var y0 = Math.min(lt.y, lb.y, rt.y, rb.y);
    var x1 = Math.max(lt.x, lb.x, rt.x, rb.x);
    var y1 = Math.max(lt.y, lb.y, rt.y, rb.y);
    rect.x = x0;
    rect.y = y0;
    rect.width = x1 - x0;
    rect.height = y1 - y0;
  };
  FilterSystem2.prototype.roundFrame = function(frame, resolution, bindingSourceFrame, bindingDestinationFrame, transform) {
    if (frame.width <= 0 || frame.height <= 0 || bindingSourceFrame.width <= 0 || bindingSourceFrame.height <= 0) {
      return;
    }
    if (transform) {
      var a2 = transform.a, b2 = transform.b, c2 = transform.c, d2 = transform.d;
      if ((Math.abs(b2) > 1e-4 || Math.abs(c2) > 1e-4) && (Math.abs(a2) > 1e-4 || Math.abs(d2) > 1e-4)) {
        return;
      }
    }
    transform = transform ? tempMatrix$2.copyFrom(transform) : tempMatrix$2.identity();
    transform.translate(-bindingSourceFrame.x, -bindingSourceFrame.y).scale(bindingDestinationFrame.width / bindingSourceFrame.width, bindingDestinationFrame.height / bindingSourceFrame.height).translate(bindingDestinationFrame.x, bindingDestinationFrame.y);
    this.transformAABB(transform, frame);
    frame.ceil(resolution);
    this.transformAABB(transform.invert(), frame);
  };
  return FilterSystem2;
}();
var ObjectRenderer = function() {
  function ObjectRenderer2(renderer) {
    this.renderer = renderer;
  }
  ObjectRenderer2.prototype.flush = function() {
  };
  ObjectRenderer2.prototype.destroy = function() {
    this.renderer = null;
  };
  ObjectRenderer2.prototype.start = function() {
  };
  ObjectRenderer2.prototype.stop = function() {
    this.flush();
  };
  ObjectRenderer2.prototype.render = function(_object) {
  };
  return ObjectRenderer2;
}();
var BatchSystem = function() {
  function BatchSystem2(renderer) {
    this.renderer = renderer;
    this.emptyRenderer = new ObjectRenderer(renderer);
    this.currentRenderer = this.emptyRenderer;
  }
  BatchSystem2.prototype.setObjectRenderer = function(objectRenderer) {
    if (this.currentRenderer === objectRenderer) {
      return;
    }
    this.currentRenderer.stop();
    this.currentRenderer = objectRenderer;
    this.currentRenderer.start();
  };
  BatchSystem2.prototype.flush = function() {
    this.setObjectRenderer(this.emptyRenderer);
  };
  BatchSystem2.prototype.reset = function() {
    this.setObjectRenderer(this.emptyRenderer);
  };
  BatchSystem2.prototype.copyBoundTextures = function(arr, maxTextures) {
    var boundTextures = this.renderer.texture.boundTextures;
    for (var i = maxTextures - 1; i >= 0; --i) {
      arr[i] = boundTextures[i] || null;
      if (arr[i]) {
        arr[i]._batchLocation = i;
      }
    }
  };
  BatchSystem2.prototype.boundArray = function(texArray, boundTextures, batchId, maxTextures) {
    var elements = texArray.elements, ids = texArray.ids, count = texArray.count;
    var j2 = 0;
    for (var i = 0; i < count; i++) {
      var tex = elements[i];
      var loc = tex._batchLocation;
      if (loc >= 0 && loc < maxTextures && boundTextures[loc] === tex) {
        ids[i] = loc;
        continue;
      }
      while (j2 < maxTextures) {
        var bound = boundTextures[j2];
        if (bound && bound._batchEnabled === batchId && bound._batchLocation === j2) {
          j2++;
          continue;
        }
        ids[i] = j2;
        tex._batchLocation = j2;
        boundTextures[j2] = tex;
        break;
      }
    }
  };
  BatchSystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  return BatchSystem2;
}();
var CONTEXT_UID_COUNTER = 0;
var ContextSystem = function() {
  function ContextSystem2(renderer) {
    this.renderer = renderer;
    this.webGLVersion = 1;
    this.extensions = {};
    this.supports = {
      uint32Indices: false
    };
    this.handleContextLost = this.handleContextLost.bind(this);
    this.handleContextRestored = this.handleContextRestored.bind(this);
    renderer.view.addEventListener("webglcontextlost", this.handleContextLost, false);
    renderer.view.addEventListener("webglcontextrestored", this.handleContextRestored, false);
  }
  Object.defineProperty(ContextSystem2.prototype, "isLost", {
    get: function() {
      return !this.gl || this.gl.isContextLost();
    },
    enumerable: false,
    configurable: true
  });
  ContextSystem2.prototype.contextChange = function(gl) {
    this.gl = gl;
    this.renderer.gl = gl;
    this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
    if (gl.isContextLost() && gl.getExtension("WEBGL_lose_context")) {
      gl.getExtension("WEBGL_lose_context").restoreContext();
    }
  };
  ContextSystem2.prototype.initFromContext = function(gl) {
    this.gl = gl;
    this.validateContext(gl);
    this.renderer.gl = gl;
    this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
    this.renderer.runners.contextChange.emit(gl);
  };
  ContextSystem2.prototype.initFromOptions = function(options) {
    var gl = this.createContext(this.renderer.view, options);
    this.initFromContext(gl);
  };
  ContextSystem2.prototype.createContext = function(canvas, options) {
    var gl;
    if (settings.PREFER_ENV >= ENV.WEBGL2) {
      gl = canvas.getContext("webgl2", options);
    }
    if (gl) {
      this.webGLVersion = 2;
    } else {
      this.webGLVersion = 1;
      gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
      if (!gl) {
        throw new Error("This browser does not support WebGL. Try using the canvas renderer");
      }
    }
    this.gl = gl;
    this.getExtensions();
    return this.gl;
  };
  ContextSystem2.prototype.getExtensions = function() {
    var gl = this.gl;
    var common = {
      anisotropicFiltering: gl.getExtension("EXT_texture_filter_anisotropic"),
      floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
      s3tc: gl.getExtension("WEBGL_compressed_texture_s3tc"),
      s3tc_sRGB: gl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
      etc: gl.getExtension("WEBGL_compressed_texture_etc"),
      etc1: gl.getExtension("WEBGL_compressed_texture_etc1"),
      pvrtc: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      atc: gl.getExtension("WEBGL_compressed_texture_atc"),
      astc: gl.getExtension("WEBGL_compressed_texture_astc")
    };
    if (this.webGLVersion === 1) {
      Object.assign(this.extensions, common, {
        drawBuffers: gl.getExtension("WEBGL_draw_buffers"),
        depthTexture: gl.getExtension("WEBGL_depth_texture"),
        loseContext: gl.getExtension("WEBGL_lose_context"),
        vertexArrayObject: gl.getExtension("OES_vertex_array_object") || gl.getExtension("MOZ_OES_vertex_array_object") || gl.getExtension("WEBKIT_OES_vertex_array_object"),
        uint32ElementIndex: gl.getExtension("OES_element_index_uint"),
        floatTexture: gl.getExtension("OES_texture_float"),
        floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
        textureHalfFloat: gl.getExtension("OES_texture_half_float"),
        textureHalfFloatLinear: gl.getExtension("OES_texture_half_float_linear")
      });
    } else if (this.webGLVersion === 2) {
      Object.assign(this.extensions, common, {
        colorBufferFloat: gl.getExtension("EXT_color_buffer_float")
      });
    }
  };
  ContextSystem2.prototype.handleContextLost = function(event) {
    event.preventDefault();
  };
  ContextSystem2.prototype.handleContextRestored = function() {
    this.renderer.runners.contextChange.emit(this.gl);
  };
  ContextSystem2.prototype.destroy = function() {
    var view = this.renderer.view;
    this.renderer = null;
    view.removeEventListener("webglcontextlost", this.handleContextLost);
    view.removeEventListener("webglcontextrestored", this.handleContextRestored);
    this.gl.useProgram(null);
    if (this.extensions.loseContext) {
      this.extensions.loseContext.loseContext();
    }
  };
  ContextSystem2.prototype.postrender = function() {
    if (this.renderer.renderingToScreen) {
      this.gl.flush();
    }
  };
  ContextSystem2.prototype.validateContext = function(gl) {
    var attributes = gl.getContextAttributes();
    var isWebGl2 = "WebGL2RenderingContext" in globalThis && gl instanceof globalThis.WebGL2RenderingContext;
    if (isWebGl2) {
      this.webGLVersion = 2;
    }
    if (attributes && !attributes.stencil) {
      console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
    }
    var hasuint32 = isWebGl2 || !!gl.getExtension("OES_element_index_uint");
    this.supports.uint32Indices = hasuint32;
    if (!hasuint32) {
      console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
    }
  };
  return ContextSystem2;
}();
var GLFramebuffer = function() {
  function GLFramebuffer2(framebuffer) {
    this.framebuffer = framebuffer;
    this.stencil = null;
    this.dirtyId = -1;
    this.dirtyFormat = -1;
    this.dirtySize = -1;
    this.multisample = MSAA_QUALITY.NONE;
    this.msaaBuffer = null;
    this.blitFramebuffer = null;
    this.mipLevel = 0;
  }
  return GLFramebuffer2;
}();
var tempRectangle = new Rectangle();
var FramebufferSystem = function() {
  function FramebufferSystem2(renderer) {
    this.renderer = renderer;
    this.managedFramebuffers = [];
    this.unknownFramebuffer = new Framebuffer(10, 10);
    this.msaaSamples = null;
  }
  FramebufferSystem2.prototype.contextChange = function() {
    var gl = this.gl = this.renderer.gl;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    this.current = this.unknownFramebuffer;
    this.viewport = new Rectangle();
    this.hasMRT = true;
    this.writeDepthTexture = true;
    this.disposeAll(true);
    if (this.renderer.context.webGLVersion === 1) {
      var nativeDrawBuffersExtension_1 = this.renderer.context.extensions.drawBuffers;
      var nativeDepthTextureExtension = this.renderer.context.extensions.depthTexture;
      if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
        nativeDrawBuffersExtension_1 = null;
        nativeDepthTextureExtension = null;
      }
      if (nativeDrawBuffersExtension_1) {
        gl.drawBuffers = function(activeTextures) {
          return nativeDrawBuffersExtension_1.drawBuffersWEBGL(activeTextures);
        };
      } else {
        this.hasMRT = false;
        gl.drawBuffers = function() {
        };
      }
      if (!nativeDepthTextureExtension) {
        this.writeDepthTexture = false;
      }
    } else {
      this.msaaSamples = gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA8, gl.SAMPLES);
    }
  };
  FramebufferSystem2.prototype.bind = function(framebuffer, frame, mipLevel) {
    if (mipLevel === void 0) {
      mipLevel = 0;
    }
    var gl = this.gl;
    if (framebuffer) {
      var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(framebuffer);
      if (this.current !== framebuffer) {
        this.current = framebuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
      }
      if (fbo.mipLevel !== mipLevel) {
        framebuffer.dirtyId++;
        framebuffer.dirtyFormat++;
        fbo.mipLevel = mipLevel;
      }
      if (fbo.dirtyId !== framebuffer.dirtyId) {
        fbo.dirtyId = framebuffer.dirtyId;
        if (fbo.dirtyFormat !== framebuffer.dirtyFormat) {
          fbo.dirtyFormat = framebuffer.dirtyFormat;
          fbo.dirtySize = framebuffer.dirtySize;
          this.updateFramebuffer(framebuffer, mipLevel);
        } else if (fbo.dirtySize !== framebuffer.dirtySize) {
          fbo.dirtySize = framebuffer.dirtySize;
          this.resizeFramebuffer(framebuffer);
        }
      }
      for (var i = 0; i < framebuffer.colorTextures.length; i++) {
        var tex = framebuffer.colorTextures[i];
        this.renderer.texture.unbind(tex.parentTextureArray || tex);
      }
      if (framebuffer.depthTexture) {
        this.renderer.texture.unbind(framebuffer.depthTexture);
      }
      if (frame) {
        var mipWidth = frame.width >> mipLevel;
        var mipHeight = frame.height >> mipLevel;
        var scale = mipWidth / frame.width;
        this.setViewport(frame.x * scale, frame.y * scale, mipWidth, mipHeight);
      } else {
        var mipWidth = framebuffer.width >> mipLevel;
        var mipHeight = framebuffer.height >> mipLevel;
        this.setViewport(0, 0, mipWidth, mipHeight);
      }
    } else {
      if (this.current) {
        this.current = null;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      if (frame) {
        this.setViewport(frame.x, frame.y, frame.width, frame.height);
      } else {
        this.setViewport(0, 0, this.renderer.width, this.renderer.height);
      }
    }
  };
  FramebufferSystem2.prototype.setViewport = function(x2, y2, width, height) {
    var v2 = this.viewport;
    x2 = Math.round(x2);
    y2 = Math.round(y2);
    width = Math.round(width);
    height = Math.round(height);
    if (v2.width !== width || v2.height !== height || v2.x !== x2 || v2.y !== y2) {
      v2.x = x2;
      v2.y = y2;
      v2.width = width;
      v2.height = height;
      this.gl.viewport(x2, y2, width, height);
    }
  };
  Object.defineProperty(FramebufferSystem2.prototype, "size", {
    get: function() {
      if (this.current) {
        return { x: 0, y: 0, width: this.current.width, height: this.current.height };
      }
      return { x: 0, y: 0, width: this.renderer.width, height: this.renderer.height };
    },
    enumerable: false,
    configurable: true
  });
  FramebufferSystem2.prototype.clear = function(r2, g2, b2, a2, mask) {
    if (mask === void 0) {
      mask = BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH;
    }
    var gl = this.gl;
    gl.clearColor(r2, g2, b2, a2);
    gl.clear(mask);
  };
  FramebufferSystem2.prototype.initFramebuffer = function(framebuffer) {
    var gl = this.gl;
    var fbo = new GLFramebuffer(gl.createFramebuffer());
    fbo.multisample = this.detectSamples(framebuffer.multisample);
    framebuffer.glFramebuffers[this.CONTEXT_UID] = fbo;
    this.managedFramebuffers.push(framebuffer);
    framebuffer.disposeRunner.add(this);
    return fbo;
  };
  FramebufferSystem2.prototype.resizeFramebuffer = function(framebuffer) {
    var gl = this.gl;
    var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
    if (fbo.msaaBuffer) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.msaaBuffer);
      gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.RGBA8, framebuffer.width, framebuffer.height);
    }
    if (fbo.stencil) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
      if (fbo.msaaBuffer) {
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, framebuffer.width, framebuffer.height);
      } else {
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
      }
    }
    var colorTextures = framebuffer.colorTextures;
    var count = colorTextures.length;
    if (!gl.drawBuffers) {
      count = Math.min(count, 1);
    }
    for (var i = 0; i < count; i++) {
      var texture = colorTextures[i];
      var parentTexture = texture.parentTextureArray || texture;
      this.renderer.texture.bind(parentTexture, 0);
    }
    if (framebuffer.depthTexture && this.writeDepthTexture) {
      this.renderer.texture.bind(framebuffer.depthTexture, 0);
    }
  };
  FramebufferSystem2.prototype.updateFramebuffer = function(framebuffer, mipLevel) {
    var gl = this.gl;
    var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
    var colorTextures = framebuffer.colorTextures;
    var count = colorTextures.length;
    if (!gl.drawBuffers) {
      count = Math.min(count, 1);
    }
    if (fbo.multisample > 1 && this.canMultisampleFramebuffer(framebuffer)) {
      fbo.msaaBuffer = fbo.msaaBuffer || gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.msaaBuffer);
      gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.RGBA8, framebuffer.width, framebuffer.height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, fbo.msaaBuffer);
    } else if (fbo.msaaBuffer) {
      gl.deleteRenderbuffer(fbo.msaaBuffer);
      fbo.msaaBuffer = null;
      if (fbo.blitFramebuffer) {
        fbo.blitFramebuffer.dispose();
        fbo.blitFramebuffer = null;
      }
    }
    var activeTextures = [];
    for (var i = 0; i < count; i++) {
      var texture = colorTextures[i];
      var parentTexture = texture.parentTextureArray || texture;
      this.renderer.texture.bind(parentTexture, 0);
      if (i === 0 && fbo.msaaBuffer) {
        continue;
      }
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, texture.target, parentTexture._glTextures[this.CONTEXT_UID].texture, mipLevel);
      activeTextures.push(gl.COLOR_ATTACHMENT0 + i);
    }
    if (activeTextures.length > 1) {
      gl.drawBuffers(activeTextures);
    }
    if (framebuffer.depthTexture) {
      var writeDepthTexture = this.writeDepthTexture;
      if (writeDepthTexture) {
        var depthTexture = framebuffer.depthTexture;
        this.renderer.texture.bind(depthTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture._glTextures[this.CONTEXT_UID].texture, mipLevel);
      }
    }
    if ((framebuffer.stencil || framebuffer.depth) && !(framebuffer.depthTexture && this.writeDepthTexture)) {
      fbo.stencil = fbo.stencil || gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
      if (fbo.msaaBuffer) {
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, framebuffer.width, framebuffer.height);
      } else {
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
      }
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, fbo.stencil);
    } else if (fbo.stencil) {
      gl.deleteRenderbuffer(fbo.stencil);
      fbo.stencil = null;
    }
  };
  FramebufferSystem2.prototype.canMultisampleFramebuffer = function(framebuffer) {
    return this.renderer.context.webGLVersion !== 1 && framebuffer.colorTextures.length <= 1 && !framebuffer.depthTexture;
  };
  FramebufferSystem2.prototype.detectSamples = function(samples) {
    var msaaSamples = this.msaaSamples;
    var res = MSAA_QUALITY.NONE;
    if (samples <= 1 || msaaSamples === null) {
      return res;
    }
    for (var i = 0; i < msaaSamples.length; i++) {
      if (msaaSamples[i] <= samples) {
        res = msaaSamples[i];
        break;
      }
    }
    if (res === 1) {
      res = MSAA_QUALITY.NONE;
    }
    return res;
  };
  FramebufferSystem2.prototype.blit = function(framebuffer, sourcePixels, destPixels) {
    var _a = this, current = _a.current, renderer = _a.renderer, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
    if (renderer.context.webGLVersion !== 2) {
      return;
    }
    if (!current) {
      return;
    }
    var fbo = current.glFramebuffers[CONTEXT_UID];
    if (!fbo) {
      return;
    }
    if (!framebuffer) {
      if (!fbo.msaaBuffer) {
        return;
      }
      var colorTexture = current.colorTextures[0];
      if (!colorTexture) {
        return;
      }
      if (!fbo.blitFramebuffer) {
        fbo.blitFramebuffer = new Framebuffer(current.width, current.height);
        fbo.blitFramebuffer.addColorTexture(0, colorTexture);
      }
      framebuffer = fbo.blitFramebuffer;
      if (framebuffer.colorTextures[0] !== colorTexture) {
        framebuffer.colorTextures[0] = colorTexture;
        framebuffer.dirtyId++;
        framebuffer.dirtyFormat++;
      }
      if (framebuffer.width !== current.width || framebuffer.height !== current.height) {
        framebuffer.width = current.width;
        framebuffer.height = current.height;
        framebuffer.dirtyId++;
        framebuffer.dirtySize++;
      }
    }
    if (!sourcePixels) {
      sourcePixels = tempRectangle;
      sourcePixels.width = current.width;
      sourcePixels.height = current.height;
    }
    if (!destPixels) {
      destPixels = sourcePixels;
    }
    var sameSize = sourcePixels.width === destPixels.width && sourcePixels.height === destPixels.height;
    this.bind(framebuffer);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbo.framebuffer);
    gl.blitFramebuffer(sourcePixels.left, sourcePixels.top, sourcePixels.right, sourcePixels.bottom, destPixels.left, destPixels.top, destPixels.right, destPixels.bottom, gl.COLOR_BUFFER_BIT, sameSize ? gl.NEAREST : gl.LINEAR);
  };
  FramebufferSystem2.prototype.disposeFramebuffer = function(framebuffer, contextLost) {
    var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
    var gl = this.gl;
    if (!fbo) {
      return;
    }
    delete framebuffer.glFramebuffers[this.CONTEXT_UID];
    var index = this.managedFramebuffers.indexOf(framebuffer);
    if (index >= 0) {
      this.managedFramebuffers.splice(index, 1);
    }
    framebuffer.disposeRunner.remove(this);
    if (!contextLost) {
      gl.deleteFramebuffer(fbo.framebuffer);
      if (fbo.msaaBuffer) {
        gl.deleteRenderbuffer(fbo.msaaBuffer);
      }
      if (fbo.stencil) {
        gl.deleteRenderbuffer(fbo.stencil);
      }
    }
    if (fbo.blitFramebuffer) {
      fbo.blitFramebuffer.dispose();
    }
  };
  FramebufferSystem2.prototype.disposeAll = function(contextLost) {
    var list = this.managedFramebuffers;
    this.managedFramebuffers = [];
    for (var i = 0; i < list.length; i++) {
      this.disposeFramebuffer(list[i], contextLost);
    }
  };
  FramebufferSystem2.prototype.forceStencil = function() {
    var framebuffer = this.current;
    if (!framebuffer) {
      return;
    }
    var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
    if (!fbo || fbo.stencil) {
      return;
    }
    framebuffer.stencil = true;
    var w2 = framebuffer.width;
    var h2 = framebuffer.height;
    var gl = this.gl;
    var stencil = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, stencil);
    if (fbo.msaaBuffer) {
      gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, w2, h2);
    } else {
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, w2, h2);
    }
    fbo.stencil = stencil;
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, stencil);
  };
  FramebufferSystem2.prototype.reset = function() {
    this.current = this.unknownFramebuffer;
    this.viewport = new Rectangle();
  };
  FramebufferSystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  return FramebufferSystem2;
}();
var byteSizeMap = { 5126: 4, 5123: 2, 5121: 1 };
var GeometrySystem = function() {
  function GeometrySystem2(renderer) {
    this.renderer = renderer;
    this._activeGeometry = null;
    this._activeVao = null;
    this.hasVao = true;
    this.hasInstance = true;
    this.canUseUInt32ElementIndex = false;
    this.managedGeometries = {};
  }
  GeometrySystem2.prototype.contextChange = function() {
    this.disposeAll(true);
    var gl = this.gl = this.renderer.gl;
    var context2 = this.renderer.context;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    if (context2.webGLVersion !== 2) {
      var nativeVaoExtension_1 = this.renderer.context.extensions.vertexArrayObject;
      if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
        nativeVaoExtension_1 = null;
      }
      if (nativeVaoExtension_1) {
        gl.createVertexArray = function() {
          return nativeVaoExtension_1.createVertexArrayOES();
        };
        gl.bindVertexArray = function(vao) {
          return nativeVaoExtension_1.bindVertexArrayOES(vao);
        };
        gl.deleteVertexArray = function(vao) {
          return nativeVaoExtension_1.deleteVertexArrayOES(vao);
        };
      } else {
        this.hasVao = false;
        gl.createVertexArray = function() {
          return null;
        };
        gl.bindVertexArray = function() {
          return null;
        };
        gl.deleteVertexArray = function() {
          return null;
        };
      }
    }
    if (context2.webGLVersion !== 2) {
      var instanceExt_1 = gl.getExtension("ANGLE_instanced_arrays");
      if (instanceExt_1) {
        gl.vertexAttribDivisor = function(a2, b2) {
          return instanceExt_1.vertexAttribDivisorANGLE(a2, b2);
        };
        gl.drawElementsInstanced = function(a2, b2, c2, d2, e) {
          return instanceExt_1.drawElementsInstancedANGLE(a2, b2, c2, d2, e);
        };
        gl.drawArraysInstanced = function(a2, b2, c2, d2) {
          return instanceExt_1.drawArraysInstancedANGLE(a2, b2, c2, d2);
        };
      } else {
        this.hasInstance = false;
      }
    }
    this.canUseUInt32ElementIndex = context2.webGLVersion === 2 || !!context2.extensions.uint32ElementIndex;
  };
  GeometrySystem2.prototype.bind = function(geometry, shader) {
    shader = shader || this.renderer.shader.shader;
    var gl = this.gl;
    var vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
    var incRefCount = false;
    if (!vaos) {
      this.managedGeometries[geometry.id] = geometry;
      geometry.disposeRunner.add(this);
      geometry.glVertexArrayObjects[this.CONTEXT_UID] = vaos = {};
      incRefCount = true;
    }
    var vao = vaos[shader.program.id] || this.initGeometryVao(geometry, shader, incRefCount);
    this._activeGeometry = geometry;
    if (this._activeVao !== vao) {
      this._activeVao = vao;
      if (this.hasVao) {
        gl.bindVertexArray(vao);
      } else {
        this.activateVao(geometry, shader.program);
      }
    }
    this.updateBuffers();
  };
  GeometrySystem2.prototype.reset = function() {
    this.unbind();
  };
  GeometrySystem2.prototype.updateBuffers = function() {
    var geometry = this._activeGeometry;
    var bufferSystem = this.renderer.buffer;
    for (var i = 0; i < geometry.buffers.length; i++) {
      var buffer = geometry.buffers[i];
      bufferSystem.update(buffer);
    }
  };
  GeometrySystem2.prototype.checkCompatibility = function(geometry, program) {
    var geometryAttributes = geometry.attributes;
    var shaderAttributes = program.attributeData;
    for (var j2 in shaderAttributes) {
      if (!geometryAttributes[j2]) {
        throw new Error('shader and geometry incompatible, geometry missing the "' + j2 + '" attribute');
      }
    }
  };
  GeometrySystem2.prototype.getSignature = function(geometry, program) {
    var attribs = geometry.attributes;
    var shaderAttributes = program.attributeData;
    var strings = ["g", geometry.id];
    for (var i in attribs) {
      if (shaderAttributes[i]) {
        strings.push(i, shaderAttributes[i].location);
      }
    }
    return strings.join("-");
  };
  GeometrySystem2.prototype.initGeometryVao = function(geometry, shader, incRefCount) {
    if (incRefCount === void 0) {
      incRefCount = true;
    }
    var gl = this.gl;
    var CONTEXT_UID = this.CONTEXT_UID;
    var bufferSystem = this.renderer.buffer;
    var program = shader.program;
    if (!program.glPrograms[CONTEXT_UID]) {
      this.renderer.shader.generateProgram(shader);
    }
    this.checkCompatibility(geometry, program);
    var signature = this.getSignature(geometry, program);
    var vaoObjectHash = geometry.glVertexArrayObjects[this.CONTEXT_UID];
    var vao = vaoObjectHash[signature];
    if (vao) {
      vaoObjectHash[program.id] = vao;
      return vao;
    }
    var buffers = geometry.buffers;
    var attributes = geometry.attributes;
    var tempStride = {};
    var tempStart = {};
    for (var j2 in buffers) {
      tempStride[j2] = 0;
      tempStart[j2] = 0;
    }
    for (var j2 in attributes) {
      if (!attributes[j2].size && program.attributeData[j2]) {
        attributes[j2].size = program.attributeData[j2].size;
      } else if (!attributes[j2].size) {
        console.warn("PIXI Geometry attribute '" + j2 + "' size cannot be determined (likely the bound shader does not have the attribute)");
      }
      tempStride[attributes[j2].buffer] += attributes[j2].size * byteSizeMap[attributes[j2].type];
    }
    for (var j2 in attributes) {
      var attribute = attributes[j2];
      var attribSize = attribute.size;
      if (attribute.stride === void 0) {
        if (tempStride[attribute.buffer] === attribSize * byteSizeMap[attribute.type]) {
          attribute.stride = 0;
        } else {
          attribute.stride = tempStride[attribute.buffer];
        }
      }
      if (attribute.start === void 0) {
        attribute.start = tempStart[attribute.buffer];
        tempStart[attribute.buffer] += attribSize * byteSizeMap[attribute.type];
      }
    }
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    for (var i = 0; i < buffers.length; i++) {
      var buffer = buffers[i];
      bufferSystem.bind(buffer);
      if (incRefCount) {
        buffer._glBuffers[CONTEXT_UID].refCount++;
      }
    }
    this.activateVao(geometry, program);
    this._activeVao = vao;
    vaoObjectHash[program.id] = vao;
    vaoObjectHash[signature] = vao;
    return vao;
  };
  GeometrySystem2.prototype.disposeGeometry = function(geometry, contextLost) {
    var _a;
    if (!this.managedGeometries[geometry.id]) {
      return;
    }
    delete this.managedGeometries[geometry.id];
    var vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
    var gl = this.gl;
    var buffers = geometry.buffers;
    var bufferSystem = (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.buffer;
    geometry.disposeRunner.remove(this);
    if (!vaos) {
      return;
    }
    if (bufferSystem) {
      for (var i = 0; i < buffers.length; i++) {
        var buf = buffers[i]._glBuffers[this.CONTEXT_UID];
        if (buf) {
          buf.refCount--;
          if (buf.refCount === 0 && !contextLost) {
            bufferSystem.dispose(buffers[i], contextLost);
          }
        }
      }
    }
    if (!contextLost) {
      for (var vaoId in vaos) {
        if (vaoId[0] === "g") {
          var vao = vaos[vaoId];
          if (this._activeVao === vao) {
            this.unbind();
          }
          gl.deleteVertexArray(vao);
        }
      }
    }
    delete geometry.glVertexArrayObjects[this.CONTEXT_UID];
  };
  GeometrySystem2.prototype.disposeAll = function(contextLost) {
    var all = Object.keys(this.managedGeometries);
    for (var i = 0; i < all.length; i++) {
      this.disposeGeometry(this.managedGeometries[all[i]], contextLost);
    }
  };
  GeometrySystem2.prototype.activateVao = function(geometry, program) {
    var gl = this.gl;
    var CONTEXT_UID = this.CONTEXT_UID;
    var bufferSystem = this.renderer.buffer;
    var buffers = geometry.buffers;
    var attributes = geometry.attributes;
    if (geometry.indexBuffer) {
      bufferSystem.bind(geometry.indexBuffer);
    }
    var lastBuffer = null;
    for (var j2 in attributes) {
      var attribute = attributes[j2];
      var buffer = buffers[attribute.buffer];
      var glBuffer = buffer._glBuffers[CONTEXT_UID];
      if (program.attributeData[j2]) {
        if (lastBuffer !== glBuffer) {
          bufferSystem.bind(buffer);
          lastBuffer = glBuffer;
        }
        var location2 = program.attributeData[j2].location;
        gl.enableVertexAttribArray(location2);
        gl.vertexAttribPointer(location2, attribute.size, attribute.type || gl.FLOAT, attribute.normalized, attribute.stride, attribute.start);
        if (attribute.instance) {
          if (this.hasInstance) {
            gl.vertexAttribDivisor(location2, 1);
          } else {
            throw new Error("geometry error, GPU Instancing is not supported on this device");
          }
        }
      }
    }
  };
  GeometrySystem2.prototype.draw = function(type, size, start, instanceCount) {
    var gl = this.gl;
    var geometry = this._activeGeometry;
    if (geometry.indexBuffer) {
      var byteSize = geometry.indexBuffer.data.BYTES_PER_ELEMENT;
      var glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
      if (byteSize === 2 || byteSize === 4 && this.canUseUInt32ElementIndex) {
        if (geometry.instanced) {
          gl.drawElementsInstanced(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize, instanceCount || 1);
        } else {
          gl.drawElements(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize);
        }
      } else {
        console.warn("unsupported index buffer type: uint32");
      }
    } else if (geometry.instanced) {
      gl.drawArraysInstanced(type, start, size || geometry.getSize(), instanceCount || 1);
    } else {
      gl.drawArrays(type, start, size || geometry.getSize());
    }
    return this;
  };
  GeometrySystem2.prototype.unbind = function() {
    this.gl.bindVertexArray(null);
    this._activeVao = null;
    this._activeGeometry = null;
  };
  GeometrySystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  return GeometrySystem2;
}();
var MaskData = function() {
  function MaskData2(maskObject) {
    if (maskObject === void 0) {
      maskObject = null;
    }
    this.type = MASK_TYPES.NONE;
    this.autoDetect = true;
    this.maskObject = maskObject || null;
    this.pooled = false;
    this.isMaskData = true;
    this.resolution = null;
    this.multisample = settings.FILTER_MULTISAMPLE;
    this.enabled = true;
    this.colorMask = 15;
    this._filters = null;
    this._stencilCounter = 0;
    this._scissorCounter = 0;
    this._scissorRect = null;
    this._scissorRectLocal = null;
    this._colorMask = 15;
    this._target = null;
  }
  Object.defineProperty(MaskData2.prototype, "filter", {
    get: function() {
      return this._filters ? this._filters[0] : null;
    },
    set: function(value) {
      if (value) {
        if (this._filters) {
          this._filters[0] = value;
        } else {
          this._filters = [value];
        }
      } else {
        this._filters = null;
      }
    },
    enumerable: false,
    configurable: true
  });
  MaskData2.prototype.reset = function() {
    if (this.pooled) {
      this.maskObject = null;
      this.type = MASK_TYPES.NONE;
      this.autoDetect = true;
    }
    this._target = null;
    this._scissorRectLocal = null;
  };
  MaskData2.prototype.copyCountersOrReset = function(maskAbove) {
    if (maskAbove) {
      this._stencilCounter = maskAbove._stencilCounter;
      this._scissorCounter = maskAbove._scissorCounter;
      this._scissorRect = maskAbove._scissorRect;
    } else {
      this._stencilCounter = 0;
      this._scissorCounter = 0;
      this._scissorRect = null;
    }
  };
  return MaskData2;
}();
function compileShader(gl, type, src) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}
function logPrettyShaderError(gl, shader) {
  var shaderSrc = gl.getShaderSource(shader).split("\n").map(function(line, index) {
    return index + ": " + line;
  });
  var shaderLog = gl.getShaderInfoLog(shader);
  var splitShader = shaderLog.split("\n");
  var dedupe = {};
  var lineNumbers = splitShader.map(function(line) {
    return parseFloat(line.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"));
  }).filter(function(n2) {
    if (n2 && !dedupe[n2]) {
      dedupe[n2] = true;
      return true;
    }
    return false;
  });
  var logArgs = [""];
  lineNumbers.forEach(function(number) {
    shaderSrc[number - 1] = "%c" + shaderSrc[number - 1] + "%c";
    logArgs.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
  });
  var fragmentSourceToLog = shaderSrc.join("\n");
  logArgs[0] = fragmentSourceToLog;
  console.error(shaderLog);
  console.groupCollapsed("click to view full shader code");
  console.warn.apply(console, logArgs);
  console.groupEnd();
}
function logProgramError(gl, program, vertexShader, fragmentShader) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      logPrettyShaderError(gl, vertexShader);
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      logPrettyShaderError(gl, fragmentShader);
    }
    console.error("PixiJS Error: Could not initialize shader.");
    if (gl.getProgramInfoLog(program) !== "") {
      console.warn("PixiJS Warning: gl.getProgramInfoLog()", gl.getProgramInfoLog(program));
    }
  }
}
function booleanArray(size) {
  var array = new Array(size);
  for (var i = 0; i < array.length; i++) {
    array[i] = false;
  }
  return array;
}
function defaultValue(type, size) {
  switch (type) {
    case "float":
      return 0;
    case "vec2":
      return new Float32Array(2 * size);
    case "vec3":
      return new Float32Array(3 * size);
    case "vec4":
      return new Float32Array(4 * size);
    case "int":
    case "uint":
    case "sampler2D":
    case "sampler2DArray":
      return 0;
    case "ivec2":
      return new Int32Array(2 * size);
    case "ivec3":
      return new Int32Array(3 * size);
    case "ivec4":
      return new Int32Array(4 * size);
    case "uvec2":
      return new Uint32Array(2 * size);
    case "uvec3":
      return new Uint32Array(3 * size);
    case "uvec4":
      return new Uint32Array(4 * size);
    case "bool":
      return false;
    case "bvec2":
      return booleanArray(2 * size);
    case "bvec3":
      return booleanArray(3 * size);
    case "bvec4":
      return booleanArray(4 * size);
    case "mat2":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}
var unknownContext = {};
var context = unknownContext;
function getTestContext() {
  if (context === unknownContext || context && context.isContextLost()) {
    var canvas = settings.ADAPTER.createCanvas();
    var gl = void 0;
    if (settings.PREFER_ENV >= ENV.WEBGL2) {
      gl = canvas.getContext("webgl2", {});
    }
    if (!gl) {
      gl = canvas.getContext("webgl", {}) || canvas.getContext("experimental-webgl", {});
      if (!gl) {
        gl = null;
      } else {
        gl.getExtension("WEBGL_draw_buffers");
      }
    }
    context = gl;
  }
  return context;
}
var maxFragmentPrecision;
function getMaxFragmentPrecision() {
  if (!maxFragmentPrecision) {
    maxFragmentPrecision = PRECISION.MEDIUM;
    var gl = getTestContext();
    if (gl) {
      if (gl.getShaderPrecisionFormat) {
        var shaderFragment = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        maxFragmentPrecision = shaderFragment.precision ? PRECISION.HIGH : PRECISION.MEDIUM;
      }
    }
  }
  return maxFragmentPrecision;
}
function setPrecision(src, requestedPrecision, maxSupportedPrecision) {
  if (src.substring(0, 9) !== "precision") {
    var precision = requestedPrecision;
    if (requestedPrecision === PRECISION.HIGH && maxSupportedPrecision !== PRECISION.HIGH) {
      precision = PRECISION.MEDIUM;
    }
    return "precision " + precision + " float;\n" + src;
  } else if (maxSupportedPrecision !== PRECISION.HIGH && src.substring(0, 15) === "precision highp") {
    return src.replace("precision highp", "precision mediump");
  }
  return src;
}
var GLSL_TO_SIZE = {
  float: 1,
  vec2: 2,
  vec3: 3,
  vec4: 4,
  int: 1,
  ivec2: 2,
  ivec3: 3,
  ivec4: 4,
  uint: 1,
  uvec2: 2,
  uvec3: 3,
  uvec4: 4,
  bool: 1,
  bvec2: 2,
  bvec3: 3,
  bvec4: 4,
  mat2: 4,
  mat3: 9,
  mat4: 16,
  sampler2D: 1
};
function mapSize(type) {
  return GLSL_TO_SIZE[type];
}
var GL_TABLE = null;
var GL_TO_GLSL_TYPES = {
  FLOAT: "float",
  FLOAT_VEC2: "vec2",
  FLOAT_VEC3: "vec3",
  FLOAT_VEC4: "vec4",
  INT: "int",
  INT_VEC2: "ivec2",
  INT_VEC3: "ivec3",
  INT_VEC4: "ivec4",
  UNSIGNED_INT: "uint",
  UNSIGNED_INT_VEC2: "uvec2",
  UNSIGNED_INT_VEC3: "uvec3",
  UNSIGNED_INT_VEC4: "uvec4",
  BOOL: "bool",
  BOOL_VEC2: "bvec2",
  BOOL_VEC3: "bvec3",
  BOOL_VEC4: "bvec4",
  FLOAT_MAT2: "mat2",
  FLOAT_MAT3: "mat3",
  FLOAT_MAT4: "mat4",
  SAMPLER_2D: "sampler2D",
  INT_SAMPLER_2D: "sampler2D",
  UNSIGNED_INT_SAMPLER_2D: "sampler2D",
  SAMPLER_CUBE: "samplerCube",
  INT_SAMPLER_CUBE: "samplerCube",
  UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
  SAMPLER_2D_ARRAY: "sampler2DArray",
  INT_SAMPLER_2D_ARRAY: "sampler2DArray",
  UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
};
function mapType(gl, type) {
  if (!GL_TABLE) {
    var typeNames = Object.keys(GL_TO_GLSL_TYPES);
    GL_TABLE = {};
    for (var i = 0; i < typeNames.length; ++i) {
      var tn = typeNames[i];
      GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
    }
  }
  return GL_TABLE[type];
}
var uniformParsers = [
  {
    test: function(data) {
      return data.type === "float" && data.size === 1;
    },
    code: function(name) {
      return '\n            if(uv["' + name + '"] !== ud["' + name + '"].value)\n            {\n                ud["' + name + '"].value = uv["' + name + '"]\n                gl.uniform1f(ud["' + name + '"].location, uv["' + name + '"])\n            }\n            ';
    }
  },
  {
    test: function(data) {
      return (data.type === "sampler2D" || data.type === "samplerCube" || data.type === "sampler2DArray") && data.size === 1 && !data.isArray;
    },
    code: function(name) {
      return 't = syncData.textureCount++;\n\n            renderer.texture.bind(uv["' + name + '"], t);\n\n            if(ud["' + name + '"].value !== t)\n            {\n                ud["' + name + '"].value = t;\n                gl.uniform1i(ud["' + name + '"].location, t);\n; // eslint-disable-line max-len\n            }';
    }
  },
  {
    test: function(data, uniform) {
      return data.type === "mat3" && data.size === 1 && uniform.a !== void 0;
    },
    code: function(name) {
      return '\n            gl.uniformMatrix3fv(ud["' + name + '"].location, false, uv["' + name + '"].toArray(true));\n            ';
    },
    codeUbo: function(name) {
      return "\n                var " + name + "_matrix = uv." + name + ".toArray(true);\n\n                data[offset] = " + name + "_matrix[0];\n                data[offset+1] = " + name + "_matrix[1];\n                data[offset+2] = " + name + "_matrix[2];\n        \n                data[offset + 4] = " + name + "_matrix[3];\n                data[offset + 5] = " + name + "_matrix[4];\n                data[offset + 6] = " + name + "_matrix[5];\n        \n                data[offset + 8] = " + name + "_matrix[6];\n                data[offset + 9] = " + name + "_matrix[7];\n                data[offset + 10] = " + name + "_matrix[8];\n            ";
    }
  },
  {
    test: function(data, uniform) {
      return data.type === "vec2" && data.size === 1 && uniform.x !== void 0;
    },
    code: function(name) {
      return '\n                cv = ud["' + name + '"].value;\n                v = uv["' + name + '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud["' + name + '"].location, v.x, v.y);\n                }';
    },
    codeUbo: function(name) {
      return "\n                v = uv." + name + ";\n\n                data[offset] = v.x;\n                data[offset+1] = v.y;\n            ";
    }
  },
  {
    test: function(data) {
      return data.type === "vec2" && data.size === 1;
    },
    code: function(name) {
      return '\n                cv = ud["' + name + '"].value;\n                v = uv["' + name + '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud["' + name + '"].location, v[0], v[1]);\n                }\n            ';
    }
  },
  {
    test: function(data, uniform) {
      return data.type === "vec4" && data.size === 1 && uniform.width !== void 0;
    },
    code: function(name) {
      return '\n                cv = ud["' + name + '"].value;\n                v = uv["' + name + '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud["' + name + '"].location, v.x, v.y, v.width, v.height)\n                }';
    },
    codeUbo: function(name) {
      return "\n                    v = uv." + name + ";\n\n                    data[offset] = v.x;\n                    data[offset+1] = v.y;\n                    data[offset+2] = v.width;\n                    data[offset+3] = v.height;\n                ";
    }
  },
  {
    test: function(data) {
      return data.type === "vec4" && data.size === 1;
    },
    code: function(name) {
      return '\n                cv = ud["' + name + '"].value;\n                v = uv["' + name + '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud["' + name + '"].location, v[0], v[1], v[2], v[3])\n                }';
    }
  }
];
var GLSL_TO_SINGLE_SETTERS_CACHED = {
  float: "\n    if (cv !== v)\n    {\n        cu.value = v;\n        gl.uniform1f(location, v);\n    }",
  vec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2f(location, v[0], v[1])\n    }",
  vec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }",
  vec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4f(location, v[0], v[1], v[2], v[3]);\n    }",
  int: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1i(location, v);\n    }",
  ivec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2i(location, v[0], v[1]);\n    }",
  ivec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3i(location, v[0], v[1], v[2]);\n    }",
  ivec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n    }",
  uint: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1ui(location, v);\n    }",
  uvec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2ui(location, v[0], v[1]);\n    }",
  uvec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3ui(location, v[0], v[1], v[2]);\n    }",
  uvec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);\n    }",
  bool: "\n    if (cv !== v)\n    {\n        cu.value = v;\n        gl.uniform1i(location, v);\n    }",
  bvec2: "\n    if (cv[0] != v[0] || cv[1] != v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2i(location, v[0], v[1]);\n    }",
  bvec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3i(location, v[0], v[1], v[2]);\n    }",
  bvec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n    }",
  mat2: "gl.uniformMatrix2fv(location, false, v)",
  mat3: "gl.uniformMatrix3fv(location, false, v)",
  mat4: "gl.uniformMatrix4fv(location, false, v)",
  sampler2D: "gl.uniform1i(location, v)",
  samplerCube: "gl.uniform1i(location, v)",
  sampler2DArray: "gl.uniform1i(location, v)"
};
var GLSL_TO_ARRAY_SETTERS = {
  float: "gl.uniform1fv(location, v)",
  vec2: "gl.uniform2fv(location, v)",
  vec3: "gl.uniform3fv(location, v)",
  vec4: "gl.uniform4fv(location, v)",
  mat4: "gl.uniformMatrix4fv(location, false, v)",
  mat3: "gl.uniformMatrix3fv(location, false, v)",
  mat2: "gl.uniformMatrix2fv(location, false, v)",
  int: "gl.uniform1iv(location, v)",
  ivec2: "gl.uniform2iv(location, v)",
  ivec3: "gl.uniform3iv(location, v)",
  ivec4: "gl.uniform4iv(location, v)",
  uint: "gl.uniform1uiv(location, v)",
  uvec2: "gl.uniform2uiv(location, v)",
  uvec3: "gl.uniform3uiv(location, v)",
  uvec4: "gl.uniform4uiv(location, v)",
  bool: "gl.uniform1iv(location, v)",
  bvec2: "gl.uniform2iv(location, v)",
  bvec3: "gl.uniform3iv(location, v)",
  bvec4: "gl.uniform4iv(location, v)",
  sampler2D: "gl.uniform1iv(location, v)",
  samplerCube: "gl.uniform1iv(location, v)",
  sampler2DArray: "gl.uniform1iv(location, v)"
};
function generateUniformsSync(group, uniformData) {
  var _a;
  var funcFragments = ["\n        var v = null;\n        var cv = null;\n        var cu = null;\n        var t = 0;\n        var gl = renderer.gl;\n    "];
  for (var i in group.uniforms) {
    var data = uniformData[i];
    if (!data) {
      if ((_a = group.uniforms[i]) === null || _a === void 0 ? void 0 : _a.group) {
        if (group.uniforms[i].ubo) {
          funcFragments.push("\n                        renderer.shader.syncUniformBufferGroup(uv." + i + ", '" + i + "');\n                    ");
        } else {
          funcFragments.push("\n                        renderer.shader.syncUniformGroup(uv." + i + ", syncData);\n                    ");
        }
      }
      continue;
    }
    var uniform = group.uniforms[i];
    var parsed = false;
    for (var j2 = 0; j2 < uniformParsers.length; j2++) {
      if (uniformParsers[j2].test(data, uniform)) {
        funcFragments.push(uniformParsers[j2].code(i, uniform));
        parsed = true;
        break;
      }
    }
    if (!parsed) {
      var templateType = data.size === 1 ? GLSL_TO_SINGLE_SETTERS_CACHED : GLSL_TO_ARRAY_SETTERS;
      var template = templateType[data.type].replace("location", 'ud["' + i + '"].location');
      funcFragments.push('\n            cu = ud["' + i + '"];\n            cv = cu.value;\n            v = uv["' + i + '"];\n            ' + template + ";");
    }
  }
  return new Function("ud", "uv", "renderer", "syncData", funcFragments.join("\n"));
}
var fragTemplate = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join("\n");
function generateIfTestSrc(maxIfs) {
  var src = "";
  for (var i = 0; i < maxIfs; ++i) {
    if (i > 0) {
      src += "\nelse ";
    }
    if (i < maxIfs - 1) {
      src += "if(test == " + i + ".0){}";
    }
  }
  return src;
}
function checkMaxIfStatementsInShader(maxIfs, gl) {
  if (maxIfs === 0) {
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  }
  var shader = gl.createShader(gl.FRAGMENT_SHADER);
  while (true) {
    var fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));
    gl.shaderSource(shader, fragmentSrc);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      maxIfs = maxIfs / 2 | 0;
    } else {
      break;
    }
  }
  return maxIfs;
}
var unsafeEval;
function unsafeEvalSupported() {
  if (typeof unsafeEval === "boolean") {
    return unsafeEval;
  }
  try {
    var func = new Function("param1", "param2", "param3", "return param1[param2] === param3;");
    unsafeEval = func({ a: "b" }, "a", "b") === true;
  } catch (e) {
    unsafeEval = false;
  }
  return unsafeEval;
}
var defaultFragment$2 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";
var defaultVertex$3 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";
var UID$1 = 0;
var nameCache = {};
var Program = function() {
  function Program2(vertexSrc, fragmentSrc, name) {
    if (name === void 0) {
      name = "pixi-shader";
    }
    this.id = UID$1++;
    this.vertexSrc = vertexSrc || Program2.defaultVertexSrc;
    this.fragmentSrc = fragmentSrc || Program2.defaultFragmentSrc;
    this.vertexSrc = this.vertexSrc.trim();
    this.fragmentSrc = this.fragmentSrc.trim();
    if (this.vertexSrc.substring(0, 8) !== "#version") {
      name = name.replace(/\s+/g, "-");
      if (nameCache[name]) {
        nameCache[name]++;
        name += "-" + nameCache[name];
      } else {
        nameCache[name] = 1;
      }
      this.vertexSrc = "#define SHADER_NAME " + name + "\n" + this.vertexSrc;
      this.fragmentSrc = "#define SHADER_NAME " + name + "\n" + this.fragmentSrc;
      this.vertexSrc = setPrecision(this.vertexSrc, settings.PRECISION_VERTEX, PRECISION.HIGH);
      this.fragmentSrc = setPrecision(this.fragmentSrc, settings.PRECISION_FRAGMENT, getMaxFragmentPrecision());
    }
    this.glPrograms = {};
    this.syncUniforms = null;
  }
  Object.defineProperty(Program2, "defaultVertexSrc", {
    get: function() {
      return defaultVertex$3;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Program2, "defaultFragmentSrc", {
    get: function() {
      return defaultFragment$2;
    },
    enumerable: false,
    configurable: true
  });
  Program2.from = function(vertexSrc, fragmentSrc, name) {
    var key = vertexSrc + fragmentSrc;
    var program = ProgramCache[key];
    if (!program) {
      ProgramCache[key] = program = new Program2(vertexSrc, fragmentSrc, name);
    }
    return program;
  };
  return Program2;
}();
var Shader = function() {
  function Shader2(program, uniforms) {
    this.uniformBindCount = 0;
    this.program = program;
    if (uniforms) {
      if (uniforms instanceof UniformGroup) {
        this.uniformGroup = uniforms;
      } else {
        this.uniformGroup = new UniformGroup(uniforms);
      }
    } else {
      this.uniformGroup = new UniformGroup({});
    }
  }
  Shader2.prototype.checkUniformExists = function(name, group) {
    if (group.uniforms[name]) {
      return true;
    }
    for (var i in group.uniforms) {
      var uniform = group.uniforms[i];
      if (uniform.group) {
        if (this.checkUniformExists(name, uniform)) {
          return true;
        }
      }
    }
    return false;
  };
  Shader2.prototype.destroy = function() {
    this.uniformGroup = null;
  };
  Object.defineProperty(Shader2.prototype, "uniforms", {
    get: function() {
      return this.uniformGroup.uniforms;
    },
    enumerable: false,
    configurable: true
  });
  Shader2.from = function(vertexSrc, fragmentSrc, uniforms) {
    var program = Program.from(vertexSrc, fragmentSrc);
    return new Shader2(program, uniforms);
  };
  return Shader2;
}();
var BLEND$1 = 0;
var OFFSET$1 = 1;
var CULLING$1 = 2;
var DEPTH_TEST$1 = 3;
var WINDING$1 = 4;
var DEPTH_MASK$1 = 5;
var State = function() {
  function State2() {
    this.data = 0;
    this.blendMode = BLEND_MODES.NORMAL;
    this.polygonOffset = 0;
    this.blend = true;
    this.depthMask = true;
  }
  Object.defineProperty(State2.prototype, "blend", {
    get: function() {
      return !!(this.data & 1 << BLEND$1);
    },
    set: function(value) {
      if (!!(this.data & 1 << BLEND$1) !== value) {
        this.data ^= 1 << BLEND$1;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(State2.prototype, "offsets", {
    get: function() {
      return !!(this.data & 1 << OFFSET$1);
    },
    set: function(value) {
      if (!!(this.data & 1 << OFFSET$1) !== value) {
        this.data ^= 1 << OFFSET$1;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(State2.prototype, "culling", {
    get: function() {
      return !!(this.data & 1 << CULLING$1);
    },
    set: function(value) {
      if (!!(this.data & 1 << CULLING$1) !== value) {
        this.data ^= 1 << CULLING$1;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(State2.prototype, "depthTest", {
    get: function() {
      return !!(this.data & 1 << DEPTH_TEST$1);
    },
    set: function(value) {
      if (!!(this.data & 1 << DEPTH_TEST$1) !== value) {
        this.data ^= 1 << DEPTH_TEST$1;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(State2.prototype, "depthMask", {
    get: function() {
      return !!(this.data & 1 << DEPTH_MASK$1);
    },
    set: function(value) {
      if (!!(this.data & 1 << DEPTH_MASK$1) !== value) {
        this.data ^= 1 << DEPTH_MASK$1;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(State2.prototype, "clockwiseFrontFace", {
    get: function() {
      return !!(this.data & 1 << WINDING$1);
    },
    set: function(value) {
      if (!!(this.data & 1 << WINDING$1) !== value) {
        this.data ^= 1 << WINDING$1;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(State2.prototype, "blendMode", {
    get: function() {
      return this._blendMode;
    },
    set: function(value) {
      this.blend = value !== BLEND_MODES.NONE;
      this._blendMode = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(State2.prototype, "polygonOffset", {
    get: function() {
      return this._polygonOffset;
    },
    set: function(value) {
      this.offsets = !!value;
      this._polygonOffset = value;
    },
    enumerable: false,
    configurable: true
  });
  State2.prototype.toString = function() {
    return "[@pixi/core:State " + ("blendMode=" + this.blendMode + " ") + ("clockwiseFrontFace=" + this.clockwiseFrontFace + " ") + ("culling=" + this.culling + " ") + ("depthMask=" + this.depthMask + " ") + ("polygonOffset=" + this.polygonOffset) + "]";
  };
  State2.for2d = function() {
    var state = new State2();
    state.depthTest = false;
    state.blend = true;
    return state;
  };
  return State2;
}();
var defaultFragment$1 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";
var defaultVertex$2 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
var Filter = function(_super) {
  __extends(Filter2, _super);
  function Filter2(vertexSrc, fragmentSrc, uniforms) {
    var _this = this;
    var program = Program.from(vertexSrc || Filter2.defaultVertexSrc, fragmentSrc || Filter2.defaultFragmentSrc);
    _this = _super.call(this, program, uniforms) || this;
    _this.padding = 0;
    _this.resolution = settings.FILTER_RESOLUTION;
    _this.multisample = settings.FILTER_MULTISAMPLE;
    _this.enabled = true;
    _this.autoFit = true;
    _this.state = new State();
    return _this;
  }
  Filter2.prototype.apply = function(filterManager, input, output, clearMode, _currentState) {
    filterManager.applyFilter(this, input, output, clearMode);
  };
  Object.defineProperty(Filter2.prototype, "blendMode", {
    get: function() {
      return this.state.blendMode;
    },
    set: function(value) {
      this.state.blendMode = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Filter2.prototype, "resolution", {
    get: function() {
      return this._resolution;
    },
    set: function(value) {
      this._resolution = value;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Filter2, "defaultVertexSrc", {
    get: function() {
      return defaultVertex$2;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Filter2, "defaultFragmentSrc", {
    get: function() {
      return defaultFragment$1;
    },
    enumerable: false,
    configurable: true
  });
  return Filter2;
}(Shader);
var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n";
var fragment = "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n";
var tempMat = new Matrix();
var TextureMatrix = function() {
  function TextureMatrix2(texture, clampMargin) {
    this._texture = texture;
    this.mapCoord = new Matrix();
    this.uClampFrame = new Float32Array(4);
    this.uClampOffset = new Float32Array(2);
    this._textureID = -1;
    this._updateID = 0;
    this.clampOffset = 0;
    this.clampMargin = typeof clampMargin === "undefined" ? 0.5 : clampMargin;
    this.isSimple = false;
  }
  Object.defineProperty(TextureMatrix2.prototype, "texture", {
    get: function() {
      return this._texture;
    },
    set: function(value) {
      this._texture = value;
      this._textureID = -1;
    },
    enumerable: false,
    configurable: true
  });
  TextureMatrix2.prototype.multiplyUvs = function(uvs, out) {
    if (out === void 0) {
      out = uvs;
    }
    var mat = this.mapCoord;
    for (var i = 0; i < uvs.length; i += 2) {
      var x2 = uvs[i];
      var y2 = uvs[i + 1];
      out[i] = x2 * mat.a + y2 * mat.c + mat.tx;
      out[i + 1] = x2 * mat.b + y2 * mat.d + mat.ty;
    }
    return out;
  };
  TextureMatrix2.prototype.update = function(forceUpdate) {
    var tex = this._texture;
    if (!tex || !tex.valid) {
      return false;
    }
    if (!forceUpdate && this._textureID === tex._updateID) {
      return false;
    }
    this._textureID = tex._updateID;
    this._updateID++;
    var uvs = tex._uvs;
    this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
    var orig = tex.orig;
    var trim = tex.trim;
    if (trim) {
      tempMat.set(orig.width / trim.width, 0, 0, orig.height / trim.height, -trim.x / trim.width, -trim.y / trim.height);
      this.mapCoord.append(tempMat);
    }
    var texBase = tex.baseTexture;
    var frame = this.uClampFrame;
    var margin = this.clampMargin / texBase.resolution;
    var offset = this.clampOffset;
    frame[0] = (tex._frame.x + margin + offset) / texBase.width;
    frame[1] = (tex._frame.y + margin + offset) / texBase.height;
    frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width;
    frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height;
    this.uClampOffset[0] = offset / texBase.realWidth;
    this.uClampOffset[1] = offset / texBase.realHeight;
    this.isSimple = tex._frame.width === texBase.width && tex._frame.height === texBase.height && tex.rotate === 0;
    return true;
  };
  return TextureMatrix2;
}();
var SpriteMaskFilter = function(_super) {
  __extends(SpriteMaskFilter2, _super);
  function SpriteMaskFilter2(vertexSrc, fragmentSrc, uniforms) {
    var _this = this;
    var sprite = null;
    if (typeof vertexSrc !== "string" && fragmentSrc === void 0 && uniforms === void 0) {
      sprite = vertexSrc;
      vertexSrc = void 0;
      fragmentSrc = void 0;
      uniforms = void 0;
    }
    _this = _super.call(this, vertexSrc || vertex, fragmentSrc || fragment, uniforms) || this;
    _this.maskSprite = sprite;
    _this.maskMatrix = new Matrix();
    return _this;
  }
  Object.defineProperty(SpriteMaskFilter2.prototype, "maskSprite", {
    get: function() {
      return this._maskSprite;
    },
    set: function(value) {
      this._maskSprite = value;
      if (this._maskSprite) {
        this._maskSprite.renderable = false;
      }
    },
    enumerable: false,
    configurable: true
  });
  SpriteMaskFilter2.prototype.apply = function(filterManager, input, output, clearMode) {
    var maskSprite = this._maskSprite;
    var tex = maskSprite._texture;
    if (!tex.valid) {
      return;
    }
    if (!tex.uvMatrix) {
      tex.uvMatrix = new TextureMatrix(tex, 0);
    }
    tex.uvMatrix.update();
    this.uniforms.npmAlpha = tex.baseTexture.alphaMode ? 0 : 1;
    this.uniforms.mask = tex;
    this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite).prepend(tex.uvMatrix.mapCoord);
    this.uniforms.alpha = maskSprite.worldAlpha;
    this.uniforms.maskClamp = tex.uvMatrix.uClampFrame;
    filterManager.applyFilter(this, input, output, clearMode);
  };
  return SpriteMaskFilter2;
}(Filter);
var MaskSystem = function() {
  function MaskSystem2(renderer) {
    this.renderer = renderer;
    this.enableScissor = true;
    this.alphaMaskPool = [];
    this.maskDataPool = [];
    this.maskStack = [];
    this.alphaMaskIndex = 0;
  }
  MaskSystem2.prototype.setMaskStack = function(maskStack) {
    this.maskStack = maskStack;
    this.renderer.scissor.setMaskStack(maskStack);
    this.renderer.stencil.setMaskStack(maskStack);
  };
  MaskSystem2.prototype.push = function(target, maskDataOrTarget) {
    var maskData = maskDataOrTarget;
    if (!maskData.isMaskData) {
      var d2 = this.maskDataPool.pop() || new MaskData();
      d2.pooled = true;
      d2.maskObject = maskDataOrTarget;
      maskData = d2;
    }
    var maskAbove = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
    maskData.copyCountersOrReset(maskAbove);
    maskData._colorMask = maskAbove ? maskAbove._colorMask : 15;
    if (maskData.autoDetect) {
      this.detect(maskData);
    }
    maskData._target = target;
    if (maskData.type !== MASK_TYPES.SPRITE) {
      this.maskStack.push(maskData);
    }
    if (maskData.enabled) {
      switch (maskData.type) {
        case MASK_TYPES.SCISSOR:
          this.renderer.scissor.push(maskData);
          break;
        case MASK_TYPES.STENCIL:
          this.renderer.stencil.push(maskData);
          break;
        case MASK_TYPES.SPRITE:
          maskData.copyCountersOrReset(null);
          this.pushSpriteMask(maskData);
          break;
        case MASK_TYPES.COLOR:
          this.pushColorMask(maskData);
          break;
      }
    }
    if (maskData.type === MASK_TYPES.SPRITE) {
      this.maskStack.push(maskData);
    }
  };
  MaskSystem2.prototype.pop = function(target) {
    var maskData = this.maskStack.pop();
    if (!maskData || maskData._target !== target) {
      return;
    }
    if (maskData.enabled) {
      switch (maskData.type) {
        case MASK_TYPES.SCISSOR:
          this.renderer.scissor.pop(maskData);
          break;
        case MASK_TYPES.STENCIL:
          this.renderer.stencil.pop(maskData.maskObject);
          break;
        case MASK_TYPES.SPRITE:
          this.popSpriteMask(maskData);
          break;
        case MASK_TYPES.COLOR:
          this.popColorMask(maskData);
          break;
      }
    }
    maskData.reset();
    if (maskData.pooled) {
      this.maskDataPool.push(maskData);
    }
    if (this.maskStack.length !== 0) {
      var maskCurrent = this.maskStack[this.maskStack.length - 1];
      if (maskCurrent.type === MASK_TYPES.SPRITE && maskCurrent._filters) {
        maskCurrent._filters[0].maskSprite = maskCurrent.maskObject;
      }
    }
  };
  MaskSystem2.prototype.detect = function(maskData) {
    var maskObject = maskData.maskObject;
    if (!maskObject) {
      maskData.type = MASK_TYPES.COLOR;
    } else if (maskObject.isSprite) {
      maskData.type = MASK_TYPES.SPRITE;
    } else if (this.enableScissor && this.renderer.scissor.testScissor(maskData)) {
      maskData.type = MASK_TYPES.SCISSOR;
    } else {
      maskData.type = MASK_TYPES.STENCIL;
    }
  };
  MaskSystem2.prototype.pushSpriteMask = function(maskData) {
    var _a, _b;
    var maskObject = maskData.maskObject;
    var target = maskData._target;
    var alphaMaskFilter = maskData._filters;
    if (!alphaMaskFilter) {
      alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
      if (!alphaMaskFilter) {
        alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new SpriteMaskFilter()];
      }
    }
    var renderer = this.renderer;
    var renderTextureSystem = renderer.renderTexture;
    var resolution;
    var multisample;
    if (renderTextureSystem.current) {
      var renderTexture = renderTextureSystem.current;
      resolution = maskData.resolution || renderTexture.resolution;
      multisample = (_a = maskData.multisample) !== null && _a !== void 0 ? _a : renderTexture.multisample;
    } else {
      resolution = maskData.resolution || renderer.resolution;
      multisample = (_b = maskData.multisample) !== null && _b !== void 0 ? _b : renderer.multisample;
    }
    alphaMaskFilter[0].resolution = resolution;
    alphaMaskFilter[0].multisample = multisample;
    alphaMaskFilter[0].maskSprite = maskObject;
    var stashFilterArea = target.filterArea;
    target.filterArea = maskObject.getBounds(true);
    renderer.filter.push(target, alphaMaskFilter);
    target.filterArea = stashFilterArea;
    if (!maskData._filters) {
      this.alphaMaskIndex++;
    }
  };
  MaskSystem2.prototype.popSpriteMask = function(maskData) {
    this.renderer.filter.pop();
    if (maskData._filters) {
      maskData._filters[0].maskSprite = null;
    } else {
      this.alphaMaskIndex--;
      this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null;
    }
  };
  MaskSystem2.prototype.pushColorMask = function(maskData) {
    var currColorMask = maskData._colorMask;
    var nextColorMask = maskData._colorMask = currColorMask & maskData.colorMask;
    if (nextColorMask !== currColorMask) {
      this.renderer.gl.colorMask((nextColorMask & 1) !== 0, (nextColorMask & 2) !== 0, (nextColorMask & 4) !== 0, (nextColorMask & 8) !== 0);
    }
  };
  MaskSystem2.prototype.popColorMask = function(maskData) {
    var currColorMask = maskData._colorMask;
    var nextColorMask = this.maskStack.length > 0 ? this.maskStack[this.maskStack.length - 1]._colorMask : 15;
    if (nextColorMask !== currColorMask) {
      this.renderer.gl.colorMask((nextColorMask & 1) !== 0, (nextColorMask & 2) !== 0, (nextColorMask & 4) !== 0, (nextColorMask & 8) !== 0);
    }
  };
  MaskSystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  return MaskSystem2;
}();
var AbstractMaskSystem = function() {
  function AbstractMaskSystem2(renderer) {
    this.renderer = renderer;
    this.maskStack = [];
    this.glConst = 0;
  }
  AbstractMaskSystem2.prototype.getStackLength = function() {
    return this.maskStack.length;
  };
  AbstractMaskSystem2.prototype.setMaskStack = function(maskStack) {
    var gl = this.renderer.gl;
    var curStackLen = this.getStackLength();
    this.maskStack = maskStack;
    var newStackLen = this.getStackLength();
    if (newStackLen !== curStackLen) {
      if (newStackLen === 0) {
        gl.disable(this.glConst);
      } else {
        gl.enable(this.glConst);
        this._useCurrent();
      }
    }
  };
  AbstractMaskSystem2.prototype._useCurrent = function() {
  };
  AbstractMaskSystem2.prototype.destroy = function() {
    this.renderer = null;
    this.maskStack = null;
  };
  return AbstractMaskSystem2;
}();
var tempMatrix$1 = new Matrix();
var rectPool = [];
var ScissorSystem = function(_super) {
  __extends(ScissorSystem2, _super);
  function ScissorSystem2(renderer) {
    var _this = _super.call(this, renderer) || this;
    _this.glConst = settings.ADAPTER.getWebGLRenderingContext().SCISSOR_TEST;
    return _this;
  }
  ScissorSystem2.prototype.getStackLength = function() {
    var maskData = this.maskStack[this.maskStack.length - 1];
    if (maskData) {
      return maskData._scissorCounter;
    }
    return 0;
  };
  ScissorSystem2.prototype.calcScissorRect = function(maskData) {
    var _a;
    if (maskData._scissorRectLocal) {
      return;
    }
    var prevData = maskData._scissorRect;
    var maskObject = maskData.maskObject;
    var renderer = this.renderer;
    var renderTextureSystem = renderer.renderTexture;
    var rect = maskObject.getBounds(true, (_a = rectPool.pop()) !== null && _a !== void 0 ? _a : new Rectangle());
    this.roundFrameToPixels(rect, renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution, renderTextureSystem.sourceFrame, renderTextureSystem.destinationFrame, renderer.projection.transform);
    if (prevData) {
      rect.fit(prevData);
    }
    maskData._scissorRectLocal = rect;
  };
  ScissorSystem2.isMatrixRotated = function(matrix) {
    if (!matrix) {
      return false;
    }
    var a2 = matrix.a, b2 = matrix.b, c2 = matrix.c, d2 = matrix.d;
    return (Math.abs(b2) > 1e-4 || Math.abs(c2) > 1e-4) && (Math.abs(a2) > 1e-4 || Math.abs(d2) > 1e-4);
  };
  ScissorSystem2.prototype.testScissor = function(maskData) {
    var maskObject = maskData.maskObject;
    if (!maskObject.isFastRect || !maskObject.isFastRect()) {
      return false;
    }
    if (ScissorSystem2.isMatrixRotated(maskObject.worldTransform)) {
      return false;
    }
    if (ScissorSystem2.isMatrixRotated(this.renderer.projection.transform)) {
      return false;
    }
    this.calcScissorRect(maskData);
    var rect = maskData._scissorRectLocal;
    return rect.width > 0 && rect.height > 0;
  };
  ScissorSystem2.prototype.roundFrameToPixels = function(frame, resolution, bindingSourceFrame, bindingDestinationFrame, transform) {
    if (ScissorSystem2.isMatrixRotated(transform)) {
      return;
    }
    transform = transform ? tempMatrix$1.copyFrom(transform) : tempMatrix$1.identity();
    transform.translate(-bindingSourceFrame.x, -bindingSourceFrame.y).scale(bindingDestinationFrame.width / bindingSourceFrame.width, bindingDestinationFrame.height / bindingSourceFrame.height).translate(bindingDestinationFrame.x, bindingDestinationFrame.y);
    this.renderer.filter.transformAABB(transform, frame);
    frame.fit(bindingDestinationFrame);
    frame.x = Math.round(frame.x * resolution);
    frame.y = Math.round(frame.y * resolution);
    frame.width = Math.round(frame.width * resolution);
    frame.height = Math.round(frame.height * resolution);
  };
  ScissorSystem2.prototype.push = function(maskData) {
    if (!maskData._scissorRectLocal) {
      this.calcScissorRect(maskData);
    }
    var gl = this.renderer.gl;
    if (!maskData._scissorRect) {
      gl.enable(gl.SCISSOR_TEST);
    }
    maskData._scissorCounter++;
    maskData._scissorRect = maskData._scissorRectLocal;
    this._useCurrent();
  };
  ScissorSystem2.prototype.pop = function(maskData) {
    var gl = this.renderer.gl;
    if (maskData) {
      rectPool.push(maskData._scissorRectLocal);
    }
    if (this.getStackLength() > 0) {
      this._useCurrent();
    } else {
      gl.disable(gl.SCISSOR_TEST);
    }
  };
  ScissorSystem2.prototype._useCurrent = function() {
    var rect = this.maskStack[this.maskStack.length - 1]._scissorRect;
    var y2;
    if (this.renderer.renderTexture.current) {
      y2 = rect.y;
    } else {
      y2 = this.renderer.height - rect.height - rect.y;
    }
    this.renderer.gl.scissor(rect.x, y2, rect.width, rect.height);
  };
  return ScissorSystem2;
}(AbstractMaskSystem);
var StencilSystem = function(_super) {
  __extends(StencilSystem2, _super);
  function StencilSystem2(renderer) {
    var _this = _super.call(this, renderer) || this;
    _this.glConst = settings.ADAPTER.getWebGLRenderingContext().STENCIL_TEST;
    return _this;
  }
  StencilSystem2.prototype.getStackLength = function() {
    var maskData = this.maskStack[this.maskStack.length - 1];
    if (maskData) {
      return maskData._stencilCounter;
    }
    return 0;
  };
  StencilSystem2.prototype.push = function(maskData) {
    var maskObject = maskData.maskObject;
    var gl = this.renderer.gl;
    var prevMaskCount = maskData._stencilCounter;
    if (prevMaskCount === 0) {
      this.renderer.framebuffer.forceStencil();
      gl.clearStencil(0);
      gl.clear(gl.STENCIL_BUFFER_BIT);
      gl.enable(gl.STENCIL_TEST);
    }
    maskData._stencilCounter++;
    var colorMask = maskData._colorMask;
    if (colorMask !== 0) {
      maskData._colorMask = 0;
      gl.colorMask(false, false, false, false);
    }
    gl.stencilFunc(gl.EQUAL, prevMaskCount, 4294967295);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
    maskObject.renderable = true;
    maskObject.render(this.renderer);
    this.renderer.batch.flush();
    maskObject.renderable = false;
    if (colorMask !== 0) {
      maskData._colorMask = colorMask;
      gl.colorMask((colorMask & 1) !== 0, (colorMask & 2) !== 0, (colorMask & 4) !== 0, (colorMask & 8) !== 0);
    }
    this._useCurrent();
  };
  StencilSystem2.prototype.pop = function(maskObject) {
    var gl = this.renderer.gl;
    if (this.getStackLength() === 0) {
      gl.disable(gl.STENCIL_TEST);
    } else {
      var maskData = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
      var colorMask = maskData ? maskData._colorMask : 15;
      if (colorMask !== 0) {
        maskData._colorMask = 0;
        gl.colorMask(false, false, false, false);
      }
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
      maskObject.renderable = true;
      maskObject.render(this.renderer);
      this.renderer.batch.flush();
      maskObject.renderable = false;
      if (colorMask !== 0) {
        maskData._colorMask = colorMask;
        gl.colorMask((colorMask & 1) !== 0, (colorMask & 2) !== 0, (colorMask & 4) !== 0, (colorMask & 8) !== 0);
      }
      this._useCurrent();
    }
  };
  StencilSystem2.prototype._useCurrent = function() {
    var gl = this.renderer.gl;
    gl.stencilFunc(gl.EQUAL, this.getStackLength(), 4294967295);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  };
  return StencilSystem2;
}(AbstractMaskSystem);
var ProjectionSystem = function() {
  function ProjectionSystem2(renderer) {
    this.renderer = renderer;
    this.destinationFrame = null;
    this.sourceFrame = null;
    this.defaultFrame = null;
    this.projectionMatrix = new Matrix();
    this.transform = null;
  }
  ProjectionSystem2.prototype.update = function(destinationFrame, sourceFrame, resolution, root) {
    this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
    this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
    this.calculateProjection(this.destinationFrame, this.sourceFrame, resolution, root);
    if (this.transform) {
      this.projectionMatrix.append(this.transform);
    }
    var renderer = this.renderer;
    renderer.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix;
    renderer.globalUniforms.update();
    if (renderer.shader.shader) {
      renderer.shader.syncUniformGroup(renderer.shader.shader.uniforms.globals);
    }
  };
  ProjectionSystem2.prototype.calculateProjection = function(_destinationFrame, sourceFrame, _resolution, root) {
    var pm = this.projectionMatrix;
    var sign2 = !root ? 1 : -1;
    pm.identity();
    pm.a = 1 / sourceFrame.width * 2;
    pm.d = sign2 * (1 / sourceFrame.height * 2);
    pm.tx = -1 - sourceFrame.x * pm.a;
    pm.ty = -sign2 - sourceFrame.y * pm.d;
  };
  ProjectionSystem2.prototype.setTransform = function(_matrix) {
  };
  ProjectionSystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  return ProjectionSystem2;
}();
var tempRect = new Rectangle();
var tempRect2 = new Rectangle();
var RenderTextureSystem = function() {
  function RenderTextureSystem2(renderer) {
    this.renderer = renderer;
    this.clearColor = renderer._backgroundColorRgba;
    this.defaultMaskStack = [];
    this.current = null;
    this.sourceFrame = new Rectangle();
    this.destinationFrame = new Rectangle();
    this.viewportFrame = new Rectangle();
  }
  RenderTextureSystem2.prototype.bind = function(renderTexture, sourceFrame, destinationFrame) {
    if (renderTexture === void 0) {
      renderTexture = null;
    }
    var renderer = this.renderer;
    this.current = renderTexture;
    var baseTexture;
    var framebuffer;
    var resolution;
    if (renderTexture) {
      baseTexture = renderTexture.baseTexture;
      resolution = baseTexture.resolution;
      if (!sourceFrame) {
        tempRect.width = renderTexture.frame.width;
        tempRect.height = renderTexture.frame.height;
        sourceFrame = tempRect;
      }
      if (!destinationFrame) {
        tempRect2.x = renderTexture.frame.x;
        tempRect2.y = renderTexture.frame.y;
        tempRect2.width = sourceFrame.width;
        tempRect2.height = sourceFrame.height;
        destinationFrame = tempRect2;
      }
      framebuffer = baseTexture.framebuffer;
    } else {
      resolution = renderer.resolution;
      if (!sourceFrame) {
        tempRect.width = renderer.screen.width;
        tempRect.height = renderer.screen.height;
        sourceFrame = tempRect;
      }
      if (!destinationFrame) {
        destinationFrame = tempRect;
        destinationFrame.width = sourceFrame.width;
        destinationFrame.height = sourceFrame.height;
      }
    }
    var viewportFrame = this.viewportFrame;
    viewportFrame.x = destinationFrame.x * resolution;
    viewportFrame.y = destinationFrame.y * resolution;
    viewportFrame.width = destinationFrame.width * resolution;
    viewportFrame.height = destinationFrame.height * resolution;
    if (!renderTexture) {
      viewportFrame.y = renderer.view.height - (viewportFrame.y + viewportFrame.height);
    }
    viewportFrame.ceil();
    this.renderer.framebuffer.bind(framebuffer, viewportFrame);
    this.renderer.projection.update(destinationFrame, sourceFrame, resolution, !framebuffer);
    if (renderTexture) {
      this.renderer.mask.setMaskStack(baseTexture.maskStack);
    } else {
      this.renderer.mask.setMaskStack(this.defaultMaskStack);
    }
    this.sourceFrame.copyFrom(sourceFrame);
    this.destinationFrame.copyFrom(destinationFrame);
  };
  RenderTextureSystem2.prototype.clear = function(clearColor, mask) {
    if (this.current) {
      clearColor = clearColor || this.current.baseTexture.clearColor;
    } else {
      clearColor = clearColor || this.clearColor;
    }
    var destinationFrame = this.destinationFrame;
    var baseFrame = this.current ? this.current.baseTexture : this.renderer.screen;
    var clearMask = destinationFrame.width !== baseFrame.width || destinationFrame.height !== baseFrame.height;
    if (clearMask) {
      var _a = this.viewportFrame, x2 = _a.x, y2 = _a.y, width = _a.width, height = _a.height;
      x2 = Math.round(x2);
      y2 = Math.round(y2);
      width = Math.round(width);
      height = Math.round(height);
      this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);
      this.renderer.gl.scissor(x2, y2, width, height);
    }
    this.renderer.framebuffer.clear(clearColor[0], clearColor[1], clearColor[2], clearColor[3], mask);
    if (clearMask) {
      this.renderer.scissor.pop();
    }
  };
  RenderTextureSystem2.prototype.resize = function() {
    this.bind(null);
  };
  RenderTextureSystem2.prototype.reset = function() {
    this.bind(null);
  };
  RenderTextureSystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  return RenderTextureSystem2;
}();
function uboUpdate(_ud, _uv, _renderer, _syncData, buffer) {
  _renderer.buffer.update(buffer);
}
var UBO_TO_SINGLE_SETTERS = {
  float: "\n        data[offset] = v;\n    ",
  vec2: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n    ",
  vec3: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n\n    ",
  vec4: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n        data[offset+3] = v[3];\n    ",
  mat2: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n\n        data[offset+4] = v[2];\n        data[offset+5] = v[3];\n    ",
  mat3: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n\n        data[offset + 4] = v[3];\n        data[offset + 5] = v[4];\n        data[offset + 6] = v[5];\n\n        data[offset + 8] = v[6];\n        data[offset + 9] = v[7];\n        data[offset + 10] = v[8];\n    ",
  mat4: "\n        for(var i = 0; i < 16; i++)\n        {\n            data[offset + i] = v[i];\n        }\n    "
};
var GLSL_TO_STD40_SIZE = {
  float: 4,
  vec2: 8,
  vec3: 12,
  vec4: 16,
  int: 4,
  ivec2: 8,
  ivec3: 12,
  ivec4: 16,
  uint: 4,
  uvec2: 8,
  uvec3: 12,
  uvec4: 16,
  bool: 4,
  bvec2: 8,
  bvec3: 12,
  bvec4: 16,
  mat2: 16 * 2,
  mat3: 16 * 3,
  mat4: 16 * 4
};
function createUBOElements(uniformData) {
  var uboElements = uniformData.map(function(data) {
    return {
      data,
      offset: 0,
      dataLen: 0,
      dirty: 0
    };
  });
  var size = 0;
  var chunkSize = 0;
  var offset = 0;
  for (var i = 0; i < uboElements.length; i++) {
    var uboElement = uboElements[i];
    size = GLSL_TO_STD40_SIZE[uboElement.data.type];
    if (uboElement.data.size > 1) {
      size = Math.max(size, 16) * uboElement.data.size;
    }
    uboElement.dataLen = size;
    if (chunkSize % size !== 0 && chunkSize < 16) {
      var lineUpValue = chunkSize % size % 16;
      chunkSize += lineUpValue;
      offset += lineUpValue;
    }
    if (chunkSize + size > 16) {
      offset = Math.ceil(offset / 16) * 16;
      uboElement.offset = offset;
      offset += size;
      chunkSize = size;
    } else {
      uboElement.offset = offset;
      chunkSize += size;
      offset += size;
    }
  }
  offset = Math.ceil(offset / 16) * 16;
  return { uboElements, size: offset };
}
function getUBOData(uniforms, uniformData) {
  var usedUniformDatas = [];
  for (var i in uniforms) {
    if (uniformData[i]) {
      usedUniformDatas.push(uniformData[i]);
    }
  }
  usedUniformDatas.sort(function(a2, b2) {
    return a2.index - b2.index;
  });
  return usedUniformDatas;
}
function generateUniformBufferSync(group, uniformData) {
  if (!group.autoManage) {
    return { size: 0, syncFunc: uboUpdate };
  }
  var usedUniformDatas = getUBOData(group.uniforms, uniformData);
  var _a = createUBOElements(usedUniformDatas), uboElements = _a.uboElements, size = _a.size;
  var funcFragments = ["\n    var v = null;\n    var v2 = null;\n    var cv = null;\n    var t = 0;\n    var gl = renderer.gl\n    var index = 0;\n    var data = buffer.data;\n    "];
  for (var i = 0; i < uboElements.length; i++) {
    var uboElement = uboElements[i];
    var uniform = group.uniforms[uboElement.data.name];
    var name = uboElement.data.name;
    var parsed = false;
    for (var j2 = 0; j2 < uniformParsers.length; j2++) {
      var uniformParser = uniformParsers[j2];
      if (uniformParser.codeUbo && uniformParser.test(uboElement.data, uniform)) {
        funcFragments.push("offset = " + uboElement.offset / 4 + ";", uniformParsers[j2].codeUbo(uboElement.data.name, uniform));
        parsed = true;
        break;
      }
    }
    if (!parsed) {
      if (uboElement.data.size > 1) {
        var size_1 = mapSize(uboElement.data.type);
        var rowSize = Math.max(GLSL_TO_STD40_SIZE[uboElement.data.type] / 16, 1);
        var elementSize = size_1 / rowSize;
        var remainder = (4 - elementSize % 4) % 4;
        funcFragments.push("\n                cv = ud." + name + ".value;\n                v = uv." + name + ";\n                offset = " + uboElement.offset / 4 + ";\n\n                t = 0;\n\n                for(var i=0; i < " + uboElement.data.size * rowSize + "; i++)\n                {\n                    for(var j = 0; j < " + elementSize + "; j++)\n                    {\n                        data[offset++] = v[t++];\n                    }\n                    offset += " + remainder + ";\n                }\n\n                ");
      } else {
        var template = UBO_TO_SINGLE_SETTERS[uboElement.data.type];
        funcFragments.push("\n                cv = ud." + name + ".value;\n                v = uv." + name + ";\n                offset = " + uboElement.offset / 4 + ";\n                " + template + ";\n                ");
      }
    }
  }
  funcFragments.push("\n       renderer.buffer.update(buffer);\n    ");
  return {
    size,
    syncFunc: new Function("ud", "uv", "renderer", "syncData", "buffer", funcFragments.join("\n"))
  };
}
var GLProgram = function() {
  function GLProgram2(program, uniformData) {
    this.program = program;
    this.uniformData = uniformData;
    this.uniformGroups = {};
    this.uniformDirtyGroups = {};
    this.uniformBufferBindings = {};
  }
  GLProgram2.prototype.destroy = function() {
    this.uniformData = null;
    this.uniformGroups = null;
    this.uniformDirtyGroups = null;
    this.uniformBufferBindings = null;
    this.program = null;
  };
  return GLProgram2;
}();
function getAttributeData(program, gl) {
  var attributes = {};
  var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < totalAttributes; i++) {
    var attribData = gl.getActiveAttrib(program, i);
    if (attribData.name.indexOf("gl_") === 0) {
      continue;
    }
    var type = mapType(gl, attribData.type);
    var data = {
      type,
      name: attribData.name,
      size: mapSize(type),
      location: gl.getAttribLocation(program, attribData.name)
    };
    attributes[attribData.name] = data;
  }
  return attributes;
}
function getUniformData(program, gl) {
  var uniforms = {};
  var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < totalUniforms; i++) {
    var uniformData = gl.getActiveUniform(program, i);
    var name = uniformData.name.replace(/\[.*?\]$/, "");
    var isArray = !!uniformData.name.match(/\[.*?\]$/);
    var type = mapType(gl, uniformData.type);
    uniforms[name] = {
      name,
      index: i,
      type,
      size: uniformData.size,
      isArray,
      value: defaultValue(type, uniformData.size)
    };
  }
  return uniforms;
}
function generateProgram(gl, program) {
  var glVertShader = compileShader(gl, gl.VERTEX_SHADER, program.vertexSrc);
  var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, program.fragmentSrc);
  var webGLProgram = gl.createProgram();
  gl.attachShader(webGLProgram, glVertShader);
  gl.attachShader(webGLProgram, glFragShader);
  gl.linkProgram(webGLProgram);
  if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)) {
    logProgramError(gl, webGLProgram, glVertShader, glFragShader);
  }
  program.attributeData = getAttributeData(webGLProgram, gl);
  program.uniformData = getUniformData(webGLProgram, gl);
  if (!/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(program.vertexSrc)) {
    var keys = Object.keys(program.attributeData);
    keys.sort(function(a2, b2) {
      return a2 > b2 ? 1 : -1;
    });
    for (var i = 0; i < keys.length; i++) {
      program.attributeData[keys[i]].location = i;
      gl.bindAttribLocation(webGLProgram, i, keys[i]);
    }
    gl.linkProgram(webGLProgram);
  }
  gl.deleteShader(glVertShader);
  gl.deleteShader(glFragShader);
  var uniformData = {};
  for (var i in program.uniformData) {
    var data = program.uniformData[i];
    uniformData[i] = {
      location: gl.getUniformLocation(webGLProgram, i),
      value: defaultValue(data.type, data.size)
    };
  }
  var glProgram = new GLProgram(webGLProgram, uniformData);
  return glProgram;
}
var UID = 0;
var defaultSyncData = { textureCount: 0, uboCount: 0 };
var ShaderSystem = function() {
  function ShaderSystem2(renderer) {
    this.destroyed = false;
    this.renderer = renderer;
    this.systemCheck();
    this.gl = null;
    this.shader = null;
    this.program = null;
    this.cache = {};
    this._uboCache = {};
    this.id = UID++;
  }
  ShaderSystem2.prototype.systemCheck = function() {
    if (!unsafeEvalSupported()) {
      throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
    }
  };
  ShaderSystem2.prototype.contextChange = function(gl) {
    this.gl = gl;
    this.reset();
  };
  ShaderSystem2.prototype.bind = function(shader, dontSync) {
    shader.uniforms.globals = this.renderer.globalUniforms;
    var program = shader.program;
    var glProgram = program.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(shader);
    this.shader = shader;
    if (this.program !== program) {
      this.program = program;
      this.gl.useProgram(glProgram.program);
    }
    if (!dontSync) {
      defaultSyncData.textureCount = 0;
      defaultSyncData.uboCount = 0;
      this.syncUniformGroup(shader.uniformGroup, defaultSyncData);
    }
    return glProgram;
  };
  ShaderSystem2.prototype.setUniforms = function(uniforms) {
    var shader = this.shader.program;
    var glProgram = shader.glPrograms[this.renderer.CONTEXT_UID];
    shader.syncUniforms(glProgram.uniformData, uniforms, this.renderer);
  };
  ShaderSystem2.prototype.syncUniformGroup = function(group, syncData) {
    var glProgram = this.getGlProgram();
    if (!group.static || group.dirtyId !== glProgram.uniformDirtyGroups[group.id]) {
      glProgram.uniformDirtyGroups[group.id] = group.dirtyId;
      this.syncUniforms(group, glProgram, syncData);
    }
  };
  ShaderSystem2.prototype.syncUniforms = function(group, glProgram, syncData) {
    var syncFunc = group.syncUniforms[this.shader.program.id] || this.createSyncGroups(group);
    syncFunc(glProgram.uniformData, group.uniforms, this.renderer, syncData);
  };
  ShaderSystem2.prototype.createSyncGroups = function(group) {
    var id = this.getSignature(group, this.shader.program.uniformData, "u");
    if (!this.cache[id]) {
      this.cache[id] = generateUniformsSync(group, this.shader.program.uniformData);
    }
    group.syncUniforms[this.shader.program.id] = this.cache[id];
    return group.syncUniforms[this.shader.program.id];
  };
  ShaderSystem2.prototype.syncUniformBufferGroup = function(group, name) {
    var glProgram = this.getGlProgram();
    if (!group.static || group.dirtyId !== 0 || !glProgram.uniformGroups[group.id]) {
      group.dirtyId = 0;
      var syncFunc = glProgram.uniformGroups[group.id] || this.createSyncBufferGroup(group, glProgram, name);
      group.buffer.update();
      syncFunc(glProgram.uniformData, group.uniforms, this.renderer, defaultSyncData, group.buffer);
    }
    this.renderer.buffer.bindBufferBase(group.buffer, glProgram.uniformBufferBindings[name]);
  };
  ShaderSystem2.prototype.createSyncBufferGroup = function(group, glProgram, name) {
    var gl = this.renderer.gl;
    this.renderer.buffer.bind(group.buffer);
    var uniformBlockIndex = this.gl.getUniformBlockIndex(glProgram.program, name);
    glProgram.uniformBufferBindings[name] = this.shader.uniformBindCount;
    gl.uniformBlockBinding(glProgram.program, uniformBlockIndex, this.shader.uniformBindCount);
    this.shader.uniformBindCount++;
    var id = this.getSignature(group, this.shader.program.uniformData, "ubo");
    var uboData = this._uboCache[id];
    if (!uboData) {
      uboData = this._uboCache[id] = generateUniformBufferSync(group, this.shader.program.uniformData);
    }
    if (group.autoManage) {
      var data = new Float32Array(uboData.size / 4);
      group.buffer.update(data);
    }
    glProgram.uniformGroups[group.id] = uboData.syncFunc;
    return glProgram.uniformGroups[group.id];
  };
  ShaderSystem2.prototype.getSignature = function(group, uniformData, preFix) {
    var uniforms = group.uniforms;
    var strings = [preFix + "-"];
    for (var i in uniforms) {
      strings.push(i);
      if (uniformData[i]) {
        strings.push(uniformData[i].type);
      }
    }
    return strings.join("-");
  };
  ShaderSystem2.prototype.getGlProgram = function() {
    if (this.shader) {
      return this.shader.program.glPrograms[this.renderer.CONTEXT_UID];
    }
    return null;
  };
  ShaderSystem2.prototype.generateProgram = function(shader) {
    var gl = this.gl;
    var program = shader.program;
    var glProgram = generateProgram(gl, program);
    program.glPrograms[this.renderer.CONTEXT_UID] = glProgram;
    return glProgram;
  };
  ShaderSystem2.prototype.reset = function() {
    this.program = null;
    this.shader = null;
  };
  ShaderSystem2.prototype.destroy = function() {
    this.renderer = null;
    this.destroyed = true;
  };
  return ShaderSystem2;
}();
function mapWebGLBlendModesToPixi(gl, array) {
  if (array === void 0) {
    array = [];
  }
  array[BLEND_MODES.NORMAL] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.ADD] = [gl.ONE, gl.ONE];
  array[BLEND_MODES.MULTIPLY] = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SCREEN] = [gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.OVERLAY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.DARKEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.LIGHTEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.COLOR_DODGE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.COLOR_BURN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.HARD_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SOFT_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.DIFFERENCE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.EXCLUSION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.HUE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SATURATION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.COLOR] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.LUMINOSITY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.NONE] = [0, 0];
  array[BLEND_MODES.NORMAL_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.ADD_NPM] = [gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE];
  array[BLEND_MODES.SCREEN_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SRC_IN] = [gl.DST_ALPHA, gl.ZERO];
  array[BLEND_MODES.SRC_OUT] = [gl.ONE_MINUS_DST_ALPHA, gl.ZERO];
  array[BLEND_MODES.SRC_ATOP] = [gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.DST_OVER] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE];
  array[BLEND_MODES.DST_IN] = [gl.ZERO, gl.SRC_ALPHA];
  array[BLEND_MODES.DST_OUT] = [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.DST_ATOP] = [gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA];
  array[BLEND_MODES.XOR] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
  array[BLEND_MODES.SUBTRACT] = [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD];
  return array;
}
var BLEND = 0;
var OFFSET = 1;
var CULLING = 2;
var DEPTH_TEST = 3;
var WINDING = 4;
var DEPTH_MASK = 5;
var StateSystem = function() {
  function StateSystem2() {
    this.gl = null;
    this.stateId = 0;
    this.polygonOffset = 0;
    this.blendMode = BLEND_MODES.NONE;
    this._blendEq = false;
    this.map = [];
    this.map[BLEND] = this.setBlend;
    this.map[OFFSET] = this.setOffset;
    this.map[CULLING] = this.setCullFace;
    this.map[DEPTH_TEST] = this.setDepthTest;
    this.map[WINDING] = this.setFrontFace;
    this.map[DEPTH_MASK] = this.setDepthMask;
    this.checks = [];
    this.defaultState = new State();
    this.defaultState.blend = true;
  }
  StateSystem2.prototype.contextChange = function(gl) {
    this.gl = gl;
    this.blendModes = mapWebGLBlendModesToPixi(gl);
    this.set(this.defaultState);
    this.reset();
  };
  StateSystem2.prototype.set = function(state) {
    state = state || this.defaultState;
    if (this.stateId !== state.data) {
      var diff = this.stateId ^ state.data;
      var i = 0;
      while (diff) {
        if (diff & 1) {
          this.map[i].call(this, !!(state.data & 1 << i));
        }
        diff = diff >> 1;
        i++;
      }
      this.stateId = state.data;
    }
    for (var i = 0; i < this.checks.length; i++) {
      this.checks[i](this, state);
    }
  };
  StateSystem2.prototype.forceState = function(state) {
    state = state || this.defaultState;
    for (var i = 0; i < this.map.length; i++) {
      this.map[i].call(this, !!(state.data & 1 << i));
    }
    for (var i = 0; i < this.checks.length; i++) {
      this.checks[i](this, state);
    }
    this.stateId = state.data;
  };
  StateSystem2.prototype.setBlend = function(value) {
    this.updateCheck(StateSystem2.checkBlendMode, value);
    this.gl[value ? "enable" : "disable"](this.gl.BLEND);
  };
  StateSystem2.prototype.setOffset = function(value) {
    this.updateCheck(StateSystem2.checkPolygonOffset, value);
    this.gl[value ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
  };
  StateSystem2.prototype.setDepthTest = function(value) {
    this.gl[value ? "enable" : "disable"](this.gl.DEPTH_TEST);
  };
  StateSystem2.prototype.setDepthMask = function(value) {
    this.gl.depthMask(value);
  };
  StateSystem2.prototype.setCullFace = function(value) {
    this.gl[value ? "enable" : "disable"](this.gl.CULL_FACE);
  };
  StateSystem2.prototype.setFrontFace = function(value) {
    this.gl.frontFace(this.gl[value ? "CW" : "CCW"]);
  };
  StateSystem2.prototype.setBlendMode = function(value) {
    if (value === this.blendMode) {
      return;
    }
    this.blendMode = value;
    var mode = this.blendModes[value];
    var gl = this.gl;
    if (mode.length === 2) {
      gl.blendFunc(mode[0], mode[1]);
    } else {
      gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
    }
    if (mode.length === 6) {
      this._blendEq = true;
      gl.blendEquationSeparate(mode[4], mode[5]);
    } else if (this._blendEq) {
      this._blendEq = false;
      gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
    }
  };
  StateSystem2.prototype.setPolygonOffset = function(value, scale) {
    this.gl.polygonOffset(value, scale);
  };
  StateSystem2.prototype.reset = function() {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
    this.forceState(this.defaultState);
    this._blendEq = true;
    this.blendMode = -1;
    this.setBlendMode(0);
  };
  StateSystem2.prototype.updateCheck = function(func, value) {
    var index = this.checks.indexOf(func);
    if (value && index === -1) {
      this.checks.push(func);
    } else if (!value && index !== -1) {
      this.checks.splice(index, 1);
    }
  };
  StateSystem2.checkBlendMode = function(system, state) {
    system.setBlendMode(state.blendMode);
  };
  StateSystem2.checkPolygonOffset = function(system, state) {
    system.setPolygonOffset(1, state.polygonOffset);
  };
  StateSystem2.prototype.destroy = function() {
    this.gl = null;
  };
  return StateSystem2;
}();
var TextureGCSystem = function() {
  function TextureGCSystem2(renderer) {
    this.renderer = renderer;
    this.count = 0;
    this.checkCount = 0;
    this.maxIdle = settings.GC_MAX_IDLE;
    this.checkCountMax = settings.GC_MAX_CHECK_COUNT;
    this.mode = settings.GC_MODE;
  }
  TextureGCSystem2.prototype.postrender = function() {
    if (!this.renderer.renderingToScreen) {
      return;
    }
    this.count++;
    if (this.mode === GC_MODES.MANUAL) {
      return;
    }
    this.checkCount++;
    if (this.checkCount > this.checkCountMax) {
      this.checkCount = 0;
      this.run();
    }
  };
  TextureGCSystem2.prototype.run = function() {
    var tm = this.renderer.texture;
    var managedTextures = tm.managedTextures;
    var wasRemoved = false;
    for (var i = 0; i < managedTextures.length; i++) {
      var texture = managedTextures[i];
      if (!texture.framebuffer && this.count - texture.touched > this.maxIdle) {
        tm.destroyTexture(texture, true);
        managedTextures[i] = null;
        wasRemoved = true;
      }
    }
    if (wasRemoved) {
      var j2 = 0;
      for (var i = 0; i < managedTextures.length; i++) {
        if (managedTextures[i] !== null) {
          managedTextures[j2++] = managedTextures[i];
        }
      }
      managedTextures.length = j2;
    }
  };
  TextureGCSystem2.prototype.unload = function(displayObject) {
    var tm = this.renderer.texture;
    var texture = displayObject._texture;
    if (texture && !texture.framebuffer) {
      tm.destroyTexture(texture);
    }
    for (var i = displayObject.children.length - 1; i >= 0; i--) {
      this.unload(displayObject.children[i]);
    }
  };
  TextureGCSystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  return TextureGCSystem2;
}();
function mapTypeAndFormatToInternalFormat(gl) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
  var table;
  if ("WebGL2RenderingContext" in globalThis && gl instanceof globalThis.WebGL2RenderingContext) {
    table = (_a = {}, _a[TYPES.UNSIGNED_BYTE] = (_b = {}, _b[FORMATS.RGBA] = gl.RGBA8, _b[FORMATS.RGB] = gl.RGB8, _b[FORMATS.RG] = gl.RG8, _b[FORMATS.RED] = gl.R8, _b[FORMATS.RGBA_INTEGER] = gl.RGBA8UI, _b[FORMATS.RGB_INTEGER] = gl.RGB8UI, _b[FORMATS.RG_INTEGER] = gl.RG8UI, _b[FORMATS.RED_INTEGER] = gl.R8UI, _b[FORMATS.ALPHA] = gl.ALPHA, _b[FORMATS.LUMINANCE] = gl.LUMINANCE, _b[FORMATS.LUMINANCE_ALPHA] = gl.LUMINANCE_ALPHA, _b), _a[TYPES.BYTE] = (_c = {}, _c[FORMATS.RGBA] = gl.RGBA8_SNORM, _c[FORMATS.RGB] = gl.RGB8_SNORM, _c[FORMATS.RG] = gl.RG8_SNORM, _c[FORMATS.RED] = gl.R8_SNORM, _c[FORMATS.RGBA_INTEGER] = gl.RGBA8I, _c[FORMATS.RGB_INTEGER] = gl.RGB8I, _c[FORMATS.RG_INTEGER] = gl.RG8I, _c[FORMATS.RED_INTEGER] = gl.R8I, _c), _a[TYPES.UNSIGNED_SHORT] = (_d = {}, _d[FORMATS.RGBA_INTEGER] = gl.RGBA16UI, _d[FORMATS.RGB_INTEGER] = gl.RGB16UI, _d[FORMATS.RG_INTEGER] = gl.RG16UI, _d[FORMATS.RED_INTEGER] = gl.R16UI, _d[FORMATS.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT16, _d), _a[TYPES.SHORT] = (_e = {}, _e[FORMATS.RGBA_INTEGER] = gl.RGBA16I, _e[FORMATS.RGB_INTEGER] = gl.RGB16I, _e[FORMATS.RG_INTEGER] = gl.RG16I, _e[FORMATS.RED_INTEGER] = gl.R16I, _e), _a[TYPES.UNSIGNED_INT] = (_f = {}, _f[FORMATS.RGBA_INTEGER] = gl.RGBA32UI, _f[FORMATS.RGB_INTEGER] = gl.RGB32UI, _f[FORMATS.RG_INTEGER] = gl.RG32UI, _f[FORMATS.RED_INTEGER] = gl.R32UI, _f[FORMATS.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT24, _f), _a[TYPES.INT] = (_g = {}, _g[FORMATS.RGBA_INTEGER] = gl.RGBA32I, _g[FORMATS.RGB_INTEGER] = gl.RGB32I, _g[FORMATS.RG_INTEGER] = gl.RG32I, _g[FORMATS.RED_INTEGER] = gl.R32I, _g), _a[TYPES.FLOAT] = (_h = {}, _h[FORMATS.RGBA] = gl.RGBA32F, _h[FORMATS.RGB] = gl.RGB32F, _h[FORMATS.RG] = gl.RG32F, _h[FORMATS.RED] = gl.R32F, _h[FORMATS.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT32F, _h), _a[TYPES.HALF_FLOAT] = (_j = {}, _j[FORMATS.RGBA] = gl.RGBA16F, _j[FORMATS.RGB] = gl.RGB16F, _j[FORMATS.RG] = gl.RG16F, _j[FORMATS.RED] = gl.R16F, _j), _a[TYPES.UNSIGNED_SHORT_5_6_5] = (_k = {}, _k[FORMATS.RGB] = gl.RGB565, _k), _a[TYPES.UNSIGNED_SHORT_4_4_4_4] = (_l = {}, _l[FORMATS.RGBA] = gl.RGBA4, _l), _a[TYPES.UNSIGNED_SHORT_5_5_5_1] = (_m = {}, _m[FORMATS.RGBA] = gl.RGB5_A1, _m), _a[TYPES.UNSIGNED_INT_2_10_10_10_REV] = (_o = {}, _o[FORMATS.RGBA] = gl.RGB10_A2, _o[FORMATS.RGBA_INTEGER] = gl.RGB10_A2UI, _o), _a[TYPES.UNSIGNED_INT_10F_11F_11F_REV] = (_p = {}, _p[FORMATS.RGB] = gl.R11F_G11F_B10F, _p), _a[TYPES.UNSIGNED_INT_5_9_9_9_REV] = (_q = {}, _q[FORMATS.RGB] = gl.RGB9_E5, _q), _a[TYPES.UNSIGNED_INT_24_8] = (_r = {}, _r[FORMATS.DEPTH_STENCIL] = gl.DEPTH24_STENCIL8, _r), _a[TYPES.FLOAT_32_UNSIGNED_INT_24_8_REV] = (_s = {}, _s[FORMATS.DEPTH_STENCIL] = gl.DEPTH32F_STENCIL8, _s), _a);
  } else {
    table = (_t = {}, _t[TYPES.UNSIGNED_BYTE] = (_u = {}, _u[FORMATS.RGBA] = gl.RGBA, _u[FORMATS.RGB] = gl.RGB, _u[FORMATS.ALPHA] = gl.ALPHA, _u[FORMATS.LUMINANCE] = gl.LUMINANCE, _u[FORMATS.LUMINANCE_ALPHA] = gl.LUMINANCE_ALPHA, _u), _t[TYPES.UNSIGNED_SHORT_5_6_5] = (_v = {}, _v[FORMATS.RGB] = gl.RGB, _v), _t[TYPES.UNSIGNED_SHORT_4_4_4_4] = (_w = {}, _w[FORMATS.RGBA] = gl.RGBA, _w), _t[TYPES.UNSIGNED_SHORT_5_5_5_1] = (_x = {}, _x[FORMATS.RGBA] = gl.RGBA, _x), _t);
  }
  return table;
}
var GLTexture = function() {
  function GLTexture2(texture) {
    this.texture = texture;
    this.width = -1;
    this.height = -1;
    this.dirtyId = -1;
    this.dirtyStyleId = -1;
    this.mipmap = false;
    this.wrapMode = 33071;
    this.type = TYPES.UNSIGNED_BYTE;
    this.internalFormat = FORMATS.RGBA;
    this.samplerType = 0;
  }
  return GLTexture2;
}();
var TextureSystem = function() {
  function TextureSystem2(renderer) {
    this.renderer = renderer;
    this.boundTextures = [];
    this.currentLocation = -1;
    this.managedTextures = [];
    this._unknownBoundTextures = false;
    this.unknownTexture = new BaseTexture();
    this.hasIntegerTextures = false;
  }
  TextureSystem2.prototype.contextChange = function() {
    var gl = this.gl = this.renderer.gl;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    this.webGLVersion = this.renderer.context.webGLVersion;
    this.internalFormats = mapTypeAndFormatToInternalFormat(gl);
    var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    this.boundTextures.length = maxTextures;
    for (var i = 0; i < maxTextures; i++) {
      this.boundTextures[i] = null;
    }
    this.emptyTextures = {};
    var emptyTexture2D = new GLTexture(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture2D.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    this.emptyTextures[gl.TEXTURE_2D] = emptyTexture2D;
    this.emptyTextures[gl.TEXTURE_CUBE_MAP] = new GLTexture(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.emptyTextures[gl.TEXTURE_CUBE_MAP].texture);
    for (var i = 0; i < 6; i++) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    for (var i = 0; i < this.boundTextures.length; i++) {
      this.bind(null, i);
    }
  };
  TextureSystem2.prototype.bind = function(texture, location2) {
    if (location2 === void 0) {
      location2 = 0;
    }
    var gl = this.gl;
    texture = texture === null || texture === void 0 ? void 0 : texture.castToBaseTexture();
    if (texture && texture.valid && !texture.parentTextureArray) {
      texture.touched = this.renderer.textureGC.count;
      var glTexture = texture._glTextures[this.CONTEXT_UID] || this.initTexture(texture);
      if (this.boundTextures[location2] !== texture) {
        if (this.currentLocation !== location2) {
          this.currentLocation = location2;
          gl.activeTexture(gl.TEXTURE0 + location2);
        }
        gl.bindTexture(texture.target, glTexture.texture);
      }
      if (glTexture.dirtyId !== texture.dirtyId) {
        if (this.currentLocation !== location2) {
          this.currentLocation = location2;
          gl.activeTexture(gl.TEXTURE0 + location2);
        }
        this.updateTexture(texture);
      }
      this.boundTextures[location2] = texture;
    } else {
      if (this.currentLocation !== location2) {
        this.currentLocation = location2;
        gl.activeTexture(gl.TEXTURE0 + location2);
      }
      gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[gl.TEXTURE_2D].texture);
      this.boundTextures[location2] = null;
    }
  };
  TextureSystem2.prototype.reset = function() {
    this._unknownBoundTextures = true;
    this.hasIntegerTextures = false;
    this.currentLocation = -1;
    for (var i = 0; i < this.boundTextures.length; i++) {
      this.boundTextures[i] = this.unknownTexture;
    }
  };
  TextureSystem2.prototype.unbind = function(texture) {
    var _a = this, gl = _a.gl, boundTextures = _a.boundTextures;
    if (this._unknownBoundTextures) {
      this._unknownBoundTextures = false;
      for (var i = 0; i < boundTextures.length; i++) {
        if (boundTextures[i] === this.unknownTexture) {
          this.bind(null, i);
        }
      }
    }
    for (var i = 0; i < boundTextures.length; i++) {
      if (boundTextures[i] === texture) {
        if (this.currentLocation !== i) {
          gl.activeTexture(gl.TEXTURE0 + i);
          this.currentLocation = i;
        }
        gl.bindTexture(texture.target, this.emptyTextures[texture.target].texture);
        boundTextures[i] = null;
      }
    }
  };
  TextureSystem2.prototype.ensureSamplerType = function(maxTextures) {
    var _a = this, boundTextures = _a.boundTextures, hasIntegerTextures = _a.hasIntegerTextures, CONTEXT_UID = _a.CONTEXT_UID;
    if (!hasIntegerTextures) {
      return;
    }
    for (var i = maxTextures - 1; i >= 0; --i) {
      var tex = boundTextures[i];
      if (tex) {
        var glTexture = tex._glTextures[CONTEXT_UID];
        if (glTexture.samplerType !== SAMPLER_TYPES.FLOAT) {
          this.renderer.texture.unbind(tex);
        }
      }
    }
  };
  TextureSystem2.prototype.initTexture = function(texture) {
    var glTexture = new GLTexture(this.gl.createTexture());
    glTexture.dirtyId = -1;
    texture._glTextures[this.CONTEXT_UID] = glTexture;
    this.managedTextures.push(texture);
    texture.on("dispose", this.destroyTexture, this);
    return glTexture;
  };
  TextureSystem2.prototype.initTextureType = function(texture, glTexture) {
    var _a, _b;
    glTexture.internalFormat = (_b = (_a = this.internalFormats[texture.type]) === null || _a === void 0 ? void 0 : _a[texture.format]) !== null && _b !== void 0 ? _b : texture.format;
    if (this.webGLVersion === 2 && texture.type === TYPES.HALF_FLOAT) {
      glTexture.type = this.gl.HALF_FLOAT;
    } else {
      glTexture.type = texture.type;
    }
  };
  TextureSystem2.prototype.updateTexture = function(texture) {
    var glTexture = texture._glTextures[this.CONTEXT_UID];
    if (!glTexture) {
      return;
    }
    var renderer = this.renderer;
    this.initTextureType(texture, glTexture);
    if (texture.resource && texture.resource.upload(renderer, texture, glTexture)) {
      if (glTexture.samplerType !== SAMPLER_TYPES.FLOAT) {
        this.hasIntegerTextures = true;
      }
    } else {
      var width = texture.realWidth;
      var height = texture.realHeight;
      var gl = renderer.gl;
      if (glTexture.width !== width || glTexture.height !== height || glTexture.dirtyId < 0) {
        glTexture.width = width;
        glTexture.height = height;
        gl.texImage2D(texture.target, 0, glTexture.internalFormat, width, height, 0, texture.format, glTexture.type, null);
      }
    }
    if (texture.dirtyStyleId !== glTexture.dirtyStyleId) {
      this.updateTextureStyle(texture);
    }
    glTexture.dirtyId = texture.dirtyId;
  };
  TextureSystem2.prototype.destroyTexture = function(texture, skipRemove) {
    var gl = this.gl;
    texture = texture.castToBaseTexture();
    if (texture._glTextures[this.CONTEXT_UID]) {
      this.unbind(texture);
      gl.deleteTexture(texture._glTextures[this.CONTEXT_UID].texture);
      texture.off("dispose", this.destroyTexture, this);
      delete texture._glTextures[this.CONTEXT_UID];
      if (!skipRemove) {
        var i = this.managedTextures.indexOf(texture);
        if (i !== -1) {
          removeItems(this.managedTextures, i, 1);
        }
      }
    }
  };
  TextureSystem2.prototype.updateTextureStyle = function(texture) {
    var glTexture = texture._glTextures[this.CONTEXT_UID];
    if (!glTexture) {
      return;
    }
    if ((texture.mipmap === MIPMAP_MODES.POW2 || this.webGLVersion !== 2) && !texture.isPowerOfTwo) {
      glTexture.mipmap = false;
    } else {
      glTexture.mipmap = texture.mipmap >= 1;
    }
    if (this.webGLVersion !== 2 && !texture.isPowerOfTwo) {
      glTexture.wrapMode = WRAP_MODES.CLAMP;
    } else {
      glTexture.wrapMode = texture.wrapMode;
    }
    if (texture.resource && texture.resource.style(this.renderer, texture, glTexture))
      ;
    else {
      this.setStyle(texture, glTexture);
    }
    glTexture.dirtyStyleId = texture.dirtyStyleId;
  };
  TextureSystem2.prototype.setStyle = function(texture, glTexture) {
    var gl = this.gl;
    if (glTexture.mipmap && texture.mipmap !== MIPMAP_MODES.ON_MANUAL) {
      gl.generateMipmap(texture.target);
    }
    gl.texParameteri(texture.target, gl.TEXTURE_WRAP_S, glTexture.wrapMode);
    gl.texParameteri(texture.target, gl.TEXTURE_WRAP_T, glTexture.wrapMode);
    if (glTexture.mipmap) {
      gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
      var anisotropicExt = this.renderer.context.extensions.anisotropicFiltering;
      if (anisotropicExt && texture.anisotropicLevel > 0 && texture.scaleMode === SCALE_MODES.LINEAR) {
        var level = Math.min(texture.anisotropicLevel, gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
        gl.texParameterf(texture.target, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, level);
      }
    } else {
      gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
    }
    gl.texParameteri(texture.target, gl.TEXTURE_MAG_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
  };
  TextureSystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  return TextureSystem2;
}();
var tempMatrix = new Matrix();
var AbstractRenderer = function(_super) {
  __extends(AbstractRenderer2, _super);
  function AbstractRenderer2(type, options) {
    if (type === void 0) {
      type = RENDERER_TYPE.UNKNOWN;
    }
    var _this = _super.call(this) || this;
    options = Object.assign({}, settings.RENDER_OPTIONS, options);
    _this.options = options;
    _this.type = type;
    _this.screen = new Rectangle(0, 0, options.width, options.height);
    _this.view = options.view || settings.ADAPTER.createCanvas();
    _this.resolution = options.resolution || settings.RESOLUTION;
    _this.useContextAlpha = options.useContextAlpha;
    _this.autoDensity = !!options.autoDensity;
    _this.preserveDrawingBuffer = options.preserveDrawingBuffer;
    _this.clearBeforeRender = options.clearBeforeRender;
    _this._backgroundColor = 0;
    _this._backgroundColorRgba = [0, 0, 0, 1];
    _this._backgroundColorString = "#000000";
    _this.backgroundColor = options.backgroundColor || _this._backgroundColor;
    _this.backgroundAlpha = options.backgroundAlpha;
    if (options.transparent !== void 0) {
      deprecation("6.0.0", "Option transparent is deprecated, please use backgroundAlpha instead.");
      _this.useContextAlpha = options.transparent;
      _this.backgroundAlpha = options.transparent ? 0 : 1;
    }
    _this._lastObjectRendered = null;
    _this.plugins = {};
    return _this;
  }
  AbstractRenderer2.prototype.initPlugins = function(staticMap) {
    for (var o in staticMap) {
      this.plugins[o] = new staticMap[o](this);
    }
  };
  Object.defineProperty(AbstractRenderer2.prototype, "width", {
    get: function() {
      return this.view.width;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(AbstractRenderer2.prototype, "height", {
    get: function() {
      return this.view.height;
    },
    enumerable: false,
    configurable: true
  });
  AbstractRenderer2.prototype.resize = function(desiredScreenWidth, desiredScreenHeight) {
    this.view.width = Math.round(desiredScreenWidth * this.resolution);
    this.view.height = Math.round(desiredScreenHeight * this.resolution);
    var screenWidth = this.view.width / this.resolution;
    var screenHeight = this.view.height / this.resolution;
    this.screen.width = screenWidth;
    this.screen.height = screenHeight;
    if (this.autoDensity) {
      this.view.style.width = screenWidth + "px";
      this.view.style.height = screenHeight + "px";
    }
    this.emit("resize", screenWidth, screenHeight);
  };
  AbstractRenderer2.prototype.generateTexture = function(displayObject, options, resolution, region) {
    if (options === void 0) {
      options = {};
    }
    if (typeof options === "number") {
      deprecation("6.1.0", "generateTexture options (scaleMode, resolution, region) are now object options.");
      options = { scaleMode: options, resolution, region };
    }
    var manualRegion = options.region, textureOptions = __rest(options, ["region"]);
    region = manualRegion || displayObject.getLocalBounds(null, true);
    if (region.width === 0) {
      region.width = 1;
    }
    if (region.height === 0) {
      region.height = 1;
    }
    var renderTexture = RenderTexture.create(__assign({ width: region.width, height: region.height }, textureOptions));
    tempMatrix.tx = -region.x;
    tempMatrix.ty = -region.y;
    this.render(displayObject, {
      renderTexture,
      clear: false,
      transform: tempMatrix,
      skipUpdateTransform: !!displayObject.parent
    });
    return renderTexture;
  };
  AbstractRenderer2.prototype.destroy = function(removeView) {
    for (var o in this.plugins) {
      this.plugins[o].destroy();
      this.plugins[o] = null;
    }
    if (removeView && this.view.parentNode) {
      this.view.parentNode.removeChild(this.view);
    }
    var thisAny = this;
    thisAny.plugins = null;
    thisAny.type = RENDERER_TYPE.UNKNOWN;
    thisAny.view = null;
    thisAny.screen = null;
    thisAny._tempDisplayObjectParent = null;
    thisAny.options = null;
    this._backgroundColorRgba = null;
    this._backgroundColorString = null;
    this._lastObjectRendered = null;
  };
  Object.defineProperty(AbstractRenderer2.prototype, "backgroundColor", {
    get: function() {
      return this._backgroundColor;
    },
    set: function(value) {
      this._backgroundColor = value;
      this._backgroundColorString = hex2string(value);
      hex2rgb(value, this._backgroundColorRgba);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(AbstractRenderer2.prototype, "backgroundAlpha", {
    get: function() {
      return this._backgroundColorRgba[3];
    },
    set: function(value) {
      this._backgroundColorRgba[3] = value;
    },
    enumerable: false,
    configurable: true
  });
  return AbstractRenderer2;
}(n);
var GLBuffer = function() {
  function GLBuffer2(buffer) {
    this.buffer = buffer || null;
    this.updateID = -1;
    this.byteLength = -1;
    this.refCount = 0;
  }
  return GLBuffer2;
}();
var BufferSystem = function() {
  function BufferSystem2(renderer) {
    this.renderer = renderer;
    this.managedBuffers = {};
    this.boundBufferBases = {};
  }
  BufferSystem2.prototype.destroy = function() {
    this.renderer = null;
  };
  BufferSystem2.prototype.contextChange = function() {
    this.disposeAll(true);
    this.gl = this.renderer.gl;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID;
  };
  BufferSystem2.prototype.bind = function(buffer) {
    var _a = this, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
    var glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
    gl.bindBuffer(buffer.type, glBuffer.buffer);
  };
  BufferSystem2.prototype.bindBufferBase = function(buffer, index) {
    var _a = this, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
    if (this.boundBufferBases[index] !== buffer) {
      var glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
      this.boundBufferBases[index] = buffer;
      gl.bindBufferBase(gl.UNIFORM_BUFFER, index, glBuffer.buffer);
    }
  };
  BufferSystem2.prototype.bindBufferRange = function(buffer, index, offset) {
    var _a = this, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
    offset = offset || 0;
    var glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
    gl.bindBufferRange(gl.UNIFORM_BUFFER, index || 0, glBuffer.buffer, offset * 256, 256);
  };
  BufferSystem2.prototype.update = function(buffer) {
    var _a = this, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
    var glBuffer = buffer._glBuffers[CONTEXT_UID];
    if (buffer._updateID === glBuffer.updateID) {
      return;
    }
    glBuffer.updateID = buffer._updateID;
    gl.bindBuffer(buffer.type, glBuffer.buffer);
    if (glBuffer.byteLength >= buffer.data.byteLength) {
      gl.bufferSubData(buffer.type, 0, buffer.data);
    } else {
      var drawType = buffer.static ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
      glBuffer.byteLength = buffer.data.byteLength;
      gl.bufferData(buffer.type, buffer.data, drawType);
    }
  };
  BufferSystem2.prototype.dispose = function(buffer, contextLost) {
    if (!this.managedBuffers[buffer.id]) {
      return;
    }
    delete this.managedBuffers[buffer.id];
    var glBuffer = buffer._glBuffers[this.CONTEXT_UID];
    var gl = this.gl;
    buffer.disposeRunner.remove(this);
    if (!glBuffer) {
      return;
    }
    if (!contextLost) {
      gl.deleteBuffer(glBuffer.buffer);
    }
    delete buffer._glBuffers[this.CONTEXT_UID];
  };
  BufferSystem2.prototype.disposeAll = function(contextLost) {
    var all = Object.keys(this.managedBuffers);
    for (var i = 0; i < all.length; i++) {
      this.dispose(this.managedBuffers[all[i]], contextLost);
    }
  };
  BufferSystem2.prototype.createGLBuffer = function(buffer) {
    var _a = this, CONTEXT_UID = _a.CONTEXT_UID, gl = _a.gl;
    buffer._glBuffers[CONTEXT_UID] = new GLBuffer(gl.createBuffer());
    this.managedBuffers[buffer.id] = buffer;
    buffer.disposeRunner.add(this);
    return buffer._glBuffers[CONTEXT_UID];
  };
  return BufferSystem2;
}();
var Renderer = function(_super) {
  __extends(Renderer2, _super);
  function Renderer2(options) {
    var _this = _super.call(this, RENDERER_TYPE.WEBGL, options) || this;
    options = _this.options;
    _this.gl = null;
    _this.CONTEXT_UID = 0;
    _this.runners = {
      destroy: new Runner("destroy"),
      contextChange: new Runner("contextChange"),
      reset: new Runner("reset"),
      update: new Runner("update"),
      postrender: new Runner("postrender"),
      prerender: new Runner("prerender"),
      resize: new Runner("resize")
    };
    _this.runners.contextChange.add(_this);
    _this.globalUniforms = new UniformGroup({
      projectionMatrix: new Matrix()
    }, true);
    _this.addSystem(MaskSystem, "mask").addSystem(ContextSystem, "context").addSystem(StateSystem, "state").addSystem(ShaderSystem, "shader").addSystem(TextureSystem, "texture").addSystem(BufferSystem, "buffer").addSystem(GeometrySystem, "geometry").addSystem(FramebufferSystem, "framebuffer").addSystem(ScissorSystem, "scissor").addSystem(StencilSystem, "stencil").addSystem(ProjectionSystem, "projection").addSystem(TextureGCSystem, "textureGC").addSystem(FilterSystem, "filter").addSystem(RenderTextureSystem, "renderTexture").addSystem(BatchSystem, "batch");
    _this.initPlugins(Renderer2.__plugins);
    _this.multisample = void 0;
    if (options.context) {
      _this.context.initFromContext(options.context);
    } else {
      _this.context.initFromOptions({
        alpha: !!_this.useContextAlpha,
        antialias: options.antialias,
        premultipliedAlpha: _this.useContextAlpha && _this.useContextAlpha !== "notMultiplied",
        stencil: true,
        preserveDrawingBuffer: options.preserveDrawingBuffer,
        powerPreference: _this.options.powerPreference
      });
    }
    _this.renderingToScreen = true;
    sayHello(_this.context.webGLVersion === 2 ? "WebGL 2" : "WebGL 1");
    _this.resize(_this.options.width, _this.options.height);
    return _this;
  }
  Renderer2.create = function(options) {
    if (isWebGLSupported()) {
      return new Renderer2(options);
    }
    throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
  };
  Renderer2.prototype.contextChange = function() {
    var gl = this.gl;
    var samples;
    if (this.context.webGLVersion === 1) {
      var framebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      samples = gl.getParameter(gl.SAMPLES);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    } else {
      var framebuffer = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
      samples = gl.getParameter(gl.SAMPLES);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, framebuffer);
    }
    if (samples >= MSAA_QUALITY.HIGH) {
      this.multisample = MSAA_QUALITY.HIGH;
    } else if (samples >= MSAA_QUALITY.MEDIUM) {
      this.multisample = MSAA_QUALITY.MEDIUM;
    } else if (samples >= MSAA_QUALITY.LOW) {
      this.multisample = MSAA_QUALITY.LOW;
    } else {
      this.multisample = MSAA_QUALITY.NONE;
    }
  };
  Renderer2.prototype.addSystem = function(ClassRef, name) {
    var system = new ClassRef(this);
    if (this[name]) {
      throw new Error('Whoops! The name "' + name + '" is already in use');
    }
    this[name] = system;
    for (var i in this.runners) {
      this.runners[i].add(system);
    }
    return this;
  };
  Renderer2.prototype.render = function(displayObject, options) {
    var renderTexture;
    var clear;
    var transform;
    var skipUpdateTransform;
    if (options) {
      if (options instanceof RenderTexture) {
        deprecation("6.0.0", "Renderer#render arguments changed, use options instead.");
        renderTexture = options;
        clear = arguments[2];
        transform = arguments[3];
        skipUpdateTransform = arguments[4];
      } else {
        renderTexture = options.renderTexture;
        clear = options.clear;
        transform = options.transform;
        skipUpdateTransform = options.skipUpdateTransform;
      }
    }
    this.renderingToScreen = !renderTexture;
    this.runners.prerender.emit();
    this.emit("prerender");
    this.projection.transform = transform;
    if (this.context.isLost) {
      return;
    }
    if (!renderTexture) {
      this._lastObjectRendered = displayObject;
    }
    if (!skipUpdateTransform) {
      var cacheParent = displayObject.enableTempParent();
      displayObject.updateTransform();
      displayObject.disableTempParent(cacheParent);
    }
    this.renderTexture.bind(renderTexture);
    this.batch.currentRenderer.start();
    if (clear !== void 0 ? clear : this.clearBeforeRender) {
      this.renderTexture.clear();
    }
    displayObject.render(this);
    this.batch.currentRenderer.flush();
    if (renderTexture) {
      renderTexture.baseTexture.update();
    }
    this.runners.postrender.emit();
    this.projection.transform = null;
    this.emit("postrender");
  };
  Renderer2.prototype.generateTexture = function(displayObject, options, resolution, region) {
    if (options === void 0) {
      options = {};
    }
    var renderTexture = _super.prototype.generateTexture.call(this, displayObject, options, resolution, region);
    this.framebuffer.blit();
    return renderTexture;
  };
  Renderer2.prototype.resize = function(desiredScreenWidth, desiredScreenHeight) {
    _super.prototype.resize.call(this, desiredScreenWidth, desiredScreenHeight);
    this.runners.resize.emit(this.screen.height, this.screen.width);
  };
  Renderer2.prototype.reset = function() {
    this.runners.reset.emit();
    return this;
  };
  Renderer2.prototype.clear = function() {
    this.renderTexture.bind();
    this.renderTexture.clear();
  };
  Renderer2.prototype.destroy = function(removeView) {
    this.runners.destroy.emit();
    for (var r2 in this.runners) {
      this.runners[r2].destroy();
    }
    _super.prototype.destroy.call(this, removeView);
    this.gl = null;
  };
  Object.defineProperty(Renderer2.prototype, "extract", {
    get: function() {
      deprecation("6.0.0", "Renderer#extract has been deprecated, please use Renderer#plugins.extract instead.");
      return this.plugins.extract;
    },
    enumerable: false,
    configurable: true
  });
  Renderer2.registerPlugin = function(pluginName, ctor) {
    deprecation("6.5.0", "Renderer.registerPlugin() has been deprecated, please use extensions.add() instead.");
    extensions.add({
      name: pluginName,
      type: ExtensionType.RendererPlugin,
      ref: ctor
    });
  };
  Renderer2.__plugins = {};
  return Renderer2;
}(AbstractRenderer);
extensions.handleByMap(ExtensionType.RendererPlugin, Renderer.__plugins);
var BatchDrawCall = function() {
  function BatchDrawCall2() {
    this.texArray = null;
    this.blend = 0;
    this.type = DRAW_MODES.TRIANGLES;
    this.start = 0;
    this.size = 0;
    this.data = null;
  }
  return BatchDrawCall2;
}();
var BatchTextureArray = function() {
  function BatchTextureArray2() {
    this.elements = [];
    this.ids = [];
    this.count = 0;
  }
  BatchTextureArray2.prototype.clear = function() {
    for (var i = 0; i < this.count; i++) {
      this.elements[i] = null;
    }
    this.count = 0;
  };
  return BatchTextureArray2;
}();
var ViewableBuffer = function() {
  function ViewableBuffer2(sizeOrBuffer) {
    if (typeof sizeOrBuffer === "number") {
      this.rawBinaryData = new ArrayBuffer(sizeOrBuffer);
    } else if (sizeOrBuffer instanceof Uint8Array) {
      this.rawBinaryData = sizeOrBuffer.buffer;
    } else {
      this.rawBinaryData = sizeOrBuffer;
    }
    this.uint32View = new Uint32Array(this.rawBinaryData);
    this.float32View = new Float32Array(this.rawBinaryData);
  }
  Object.defineProperty(ViewableBuffer2.prototype, "int8View", {
    get: function() {
      if (!this._int8View) {
        this._int8View = new Int8Array(this.rawBinaryData);
      }
      return this._int8View;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ViewableBuffer2.prototype, "uint8View", {
    get: function() {
      if (!this._uint8View) {
        this._uint8View = new Uint8Array(this.rawBinaryData);
      }
      return this._uint8View;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ViewableBuffer2.prototype, "int16View", {
    get: function() {
      if (!this._int16View) {
        this._int16View = new Int16Array(this.rawBinaryData);
      }
      return this._int16View;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ViewableBuffer2.prototype, "uint16View", {
    get: function() {
      if (!this._uint16View) {
        this._uint16View = new Uint16Array(this.rawBinaryData);
      }
      return this._uint16View;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ViewableBuffer2.prototype, "int32View", {
    get: function() {
      if (!this._int32View) {
        this._int32View = new Int32Array(this.rawBinaryData);
      }
      return this._int32View;
    },
    enumerable: false,
    configurable: true
  });
  ViewableBuffer2.prototype.view = function(type) {
    return this[type + "View"];
  };
  ViewableBuffer2.prototype.destroy = function() {
    this.rawBinaryData = null;
    this._int8View = null;
    this._uint8View = null;
    this._int16View = null;
    this._uint16View = null;
    this._int32View = null;
    this.uint32View = null;
    this.float32View = null;
  };
  ViewableBuffer2.sizeOf = function(type) {
    switch (type) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(type + " isn't a valid view type");
    }
  };
  return ViewableBuffer2;
}();
var AbstractBatchRenderer = function(_super) {
  __extends(AbstractBatchRenderer2, _super);
  function AbstractBatchRenderer2(renderer) {
    var _this = _super.call(this, renderer) || this;
    _this.shaderGenerator = null;
    _this.geometryClass = null;
    _this.vertexSize = null;
    _this.state = State.for2d();
    _this.size = settings.SPRITE_BATCH_SIZE * 4;
    _this._vertexCount = 0;
    _this._indexCount = 0;
    _this._bufferedElements = [];
    _this._bufferedTextures = [];
    _this._bufferSize = 0;
    _this._shader = null;
    _this._packedGeometries = [];
    _this._packedGeometryPoolSize = 2;
    _this._flushId = 0;
    _this._aBuffers = {};
    _this._iBuffers = {};
    _this.MAX_TEXTURES = 1;
    _this.renderer.on("prerender", _this.onPrerender, _this);
    renderer.runners.contextChange.add(_this);
    _this._dcIndex = 0;
    _this._aIndex = 0;
    _this._iIndex = 0;
    _this._attributeBuffer = null;
    _this._indexBuffer = null;
    _this._tempBoundTextures = [];
    return _this;
  }
  AbstractBatchRenderer2.prototype.contextChange = function() {
    var gl = this.renderer.gl;
    if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
      this.MAX_TEXTURES = 1;
    } else {
      this.MAX_TEXTURES = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), settings.SPRITE_MAX_TEXTURES);
      this.MAX_TEXTURES = checkMaxIfStatementsInShader(this.MAX_TEXTURES, gl);
    }
    this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
    for (var i = 0; i < this._packedGeometryPoolSize; i++) {
      this._packedGeometries[i] = new this.geometryClass();
    }
    this.initFlushBuffers();
  };
  AbstractBatchRenderer2.prototype.initFlushBuffers = function() {
    var _drawCallPool = AbstractBatchRenderer2._drawCallPool, _textureArrayPool = AbstractBatchRenderer2._textureArrayPool;
    var MAX_SPRITES = this.size / 4;
    var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;
    while (_drawCallPool.length < MAX_SPRITES) {
      _drawCallPool.push(new BatchDrawCall());
    }
    while (_textureArrayPool.length < MAX_TA) {
      _textureArrayPool.push(new BatchTextureArray());
    }
    for (var i = 0; i < this.MAX_TEXTURES; i++) {
      this._tempBoundTextures[i] = null;
    }
  };
  AbstractBatchRenderer2.prototype.onPrerender = function() {
    this._flushId = 0;
  };
  AbstractBatchRenderer2.prototype.render = function(element) {
    if (!element._texture.valid) {
      return;
    }
    if (this._vertexCount + element.vertexData.length / 2 > this.size) {
      this.flush();
    }
    this._vertexCount += element.vertexData.length / 2;
    this._indexCount += element.indices.length;
    this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
    this._bufferedElements[this._bufferSize++] = element;
  };
  AbstractBatchRenderer2.prototype.buildTexturesAndDrawCalls = function() {
    var _a = this, textures = _a._bufferedTextures, MAX_TEXTURES = _a.MAX_TEXTURES;
    var textureArrays = AbstractBatchRenderer2._textureArrayPool;
    var batch = this.renderer.batch;
    var boundTextures = this._tempBoundTextures;
    var touch = this.renderer.textureGC.count;
    var TICK = ++BaseTexture._globalBatch;
    var countTexArrays = 0;
    var texArray = textureArrays[0];
    var start = 0;
    batch.copyBoundTextures(boundTextures, MAX_TEXTURES);
    for (var i = 0; i < this._bufferSize; ++i) {
      var tex = textures[i];
      textures[i] = null;
      if (tex._batchEnabled === TICK) {
        continue;
      }
      if (texArray.count >= MAX_TEXTURES) {
        batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
        this.buildDrawCalls(texArray, start, i);
        start = i;
        texArray = textureArrays[++countTexArrays];
        ++TICK;
      }
      tex._batchEnabled = TICK;
      tex.touched = touch;
      texArray.elements[texArray.count++] = tex;
    }
    if (texArray.count > 0) {
      batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
      this.buildDrawCalls(texArray, start, this._bufferSize);
      ++countTexArrays;
      ++TICK;
    }
    for (var i = 0; i < boundTextures.length; i++) {
      boundTextures[i] = null;
    }
    BaseTexture._globalBatch = TICK;
  };
  AbstractBatchRenderer2.prototype.buildDrawCalls = function(texArray, start, finish) {
    var _a = this, elements = _a._bufferedElements, _attributeBuffer = _a._attributeBuffer, _indexBuffer = _a._indexBuffer, vertexSize = _a.vertexSize;
    var drawCalls = AbstractBatchRenderer2._drawCallPool;
    var dcIndex = this._dcIndex;
    var aIndex = this._aIndex;
    var iIndex = this._iIndex;
    var drawCall = drawCalls[dcIndex];
    drawCall.start = this._iIndex;
    drawCall.texArray = texArray;
    for (var i = start; i < finish; ++i) {
      var sprite = elements[i];
      var tex = sprite._texture.baseTexture;
      var spriteBlendMode = premultiplyBlendMode[tex.alphaMode ? 1 : 0][sprite.blendMode];
      elements[i] = null;
      if (start < i && drawCall.blend !== spriteBlendMode) {
        drawCall.size = iIndex - drawCall.start;
        start = i;
        drawCall = drawCalls[++dcIndex];
        drawCall.texArray = texArray;
        drawCall.start = iIndex;
      }
      this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
      aIndex += sprite.vertexData.length / 2 * vertexSize;
      iIndex += sprite.indices.length;
      drawCall.blend = spriteBlendMode;
    }
    if (start < finish) {
      drawCall.size = iIndex - drawCall.start;
      ++dcIndex;
    }
    this._dcIndex = dcIndex;
    this._aIndex = aIndex;
    this._iIndex = iIndex;
  };
  AbstractBatchRenderer2.prototype.bindAndClearTexArray = function(texArray) {
    var textureSystem = this.renderer.texture;
    for (var j2 = 0; j2 < texArray.count; j2++) {
      textureSystem.bind(texArray.elements[j2], texArray.ids[j2]);
      texArray.elements[j2] = null;
    }
    texArray.count = 0;
  };
  AbstractBatchRenderer2.prototype.updateGeometry = function() {
    var _a = this, packedGeometries = _a._packedGeometries, attributeBuffer = _a._attributeBuffer, indexBuffer = _a._indexBuffer;
    if (!settings.CAN_UPLOAD_SAME_BUFFER) {
      if (this._packedGeometryPoolSize <= this._flushId) {
        this._packedGeometryPoolSize++;
        packedGeometries[this._flushId] = new this.geometryClass();
      }
      packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
      packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
      this.renderer.geometry.bind(packedGeometries[this._flushId]);
      this.renderer.geometry.updateBuffers();
      this._flushId++;
    } else {
      packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
      packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
      this.renderer.geometry.updateBuffers();
    }
  };
  AbstractBatchRenderer2.prototype.drawBatches = function() {
    var dcCount = this._dcIndex;
    var _a = this.renderer, gl = _a.gl, stateSystem = _a.state;
    var drawCalls = AbstractBatchRenderer2._drawCallPool;
    var curTexArray = null;
    for (var i = 0; i < dcCount; i++) {
      var _b = drawCalls[i], texArray = _b.texArray, type = _b.type, size = _b.size, start = _b.start, blend = _b.blend;
      if (curTexArray !== texArray) {
        curTexArray = texArray;
        this.bindAndClearTexArray(texArray);
      }
      this.state.blendMode = blend;
      stateSystem.set(this.state);
      gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
    }
  };
  AbstractBatchRenderer2.prototype.flush = function() {
    if (this._vertexCount === 0) {
      return;
    }
    this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
    this._indexBuffer = this.getIndexBuffer(this._indexCount);
    this._aIndex = 0;
    this._iIndex = 0;
    this._dcIndex = 0;
    this.buildTexturesAndDrawCalls();
    this.updateGeometry();
    this.drawBatches();
    this._bufferSize = 0;
    this._vertexCount = 0;
    this._indexCount = 0;
  };
  AbstractBatchRenderer2.prototype.start = function() {
    this.renderer.state.set(this.state);
    this.renderer.texture.ensureSamplerType(this.MAX_TEXTURES);
    this.renderer.shader.bind(this._shader);
    if (settings.CAN_UPLOAD_SAME_BUFFER) {
      this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }
  };
  AbstractBatchRenderer2.prototype.stop = function() {
    this.flush();
  };
  AbstractBatchRenderer2.prototype.destroy = function() {
    for (var i = 0; i < this._packedGeometryPoolSize; i++) {
      if (this._packedGeometries[i]) {
        this._packedGeometries[i].destroy();
      }
    }
    this.renderer.off("prerender", this.onPrerender, this);
    this._aBuffers = null;
    this._iBuffers = null;
    this._packedGeometries = null;
    this._attributeBuffer = null;
    this._indexBuffer = null;
    if (this._shader) {
      this._shader.destroy();
      this._shader = null;
    }
    _super.prototype.destroy.call(this);
  };
  AbstractBatchRenderer2.prototype.getAttributeBuffer = function(size) {
    var roundedP2 = nextPow2(Math.ceil(size / 8));
    var roundedSizeIndex = log2(roundedP2);
    var roundedSize = roundedP2 * 8;
    if (this._aBuffers.length <= roundedSizeIndex) {
      this._iBuffers.length = roundedSizeIndex + 1;
    }
    var buffer = this._aBuffers[roundedSize];
    if (!buffer) {
      this._aBuffers[roundedSize] = buffer = new ViewableBuffer(roundedSize * this.vertexSize * 4);
    }
    return buffer;
  };
  AbstractBatchRenderer2.prototype.getIndexBuffer = function(size) {
    var roundedP2 = nextPow2(Math.ceil(size / 12));
    var roundedSizeIndex = log2(roundedP2);
    var roundedSize = roundedP2 * 12;
    if (this._iBuffers.length <= roundedSizeIndex) {
      this._iBuffers.length = roundedSizeIndex + 1;
    }
    var buffer = this._iBuffers[roundedSizeIndex];
    if (!buffer) {
      this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
    }
    return buffer;
  };
  AbstractBatchRenderer2.prototype.packInterleavedGeometry = function(element, attributeBuffer, indexBuffer, aIndex, iIndex) {
    var uint32View = attributeBuffer.uint32View, float32View = attributeBuffer.float32View;
    var packedVertices = aIndex / this.vertexSize;
    var uvs = element.uvs;
    var indicies = element.indices;
    var vertexData = element.vertexData;
    var textureId = element._texture.baseTexture._batchLocation;
    var alpha = Math.min(element.worldAlpha, 1);
    var argb = alpha < 1 && element._texture.baseTexture.alphaMode ? premultiplyTint(element._tintRGB, alpha) : element._tintRGB + (alpha * 255 << 24);
    for (var i = 0; i < vertexData.length; i += 2) {
      float32View[aIndex++] = vertexData[i];
      float32View[aIndex++] = vertexData[i + 1];
      float32View[aIndex++] = uvs[i];
      float32View[aIndex++] = uvs[i + 1];
      uint32View[aIndex++] = argb;
      float32View[aIndex++] = textureId;
    }
    for (var i = 0; i < indicies.length; i++) {
      indexBuffer[iIndex++] = packedVertices + indicies[i];
    }
  };
  AbstractBatchRenderer2._drawCallPool = [];
  AbstractBatchRenderer2._textureArrayPool = [];
  return AbstractBatchRenderer2;
}(ObjectRenderer);
var BatchShaderGenerator = function() {
  function BatchShaderGenerator2(vertexSrc, fragTemplate2) {
    this.vertexSrc = vertexSrc;
    this.fragTemplate = fragTemplate2;
    this.programCache = {};
    this.defaultGroupCache = {};
    if (fragTemplate2.indexOf("%count%") < 0) {
      throw new Error('Fragment template must contain "%count%".');
    }
    if (fragTemplate2.indexOf("%forloop%") < 0) {
      throw new Error('Fragment template must contain "%forloop%".');
    }
  }
  BatchShaderGenerator2.prototype.generateShader = function(maxTextures) {
    if (!this.programCache[maxTextures]) {
      var sampleValues = new Int32Array(maxTextures);
      for (var i = 0; i < maxTextures; i++) {
        sampleValues[i] = i;
      }
      this.defaultGroupCache[maxTextures] = UniformGroup.from({ uSamplers: sampleValues }, true);
      var fragmentSrc = this.fragTemplate;
      fragmentSrc = fragmentSrc.replace(/%count%/gi, "" + maxTextures);
      fragmentSrc = fragmentSrc.replace(/%forloop%/gi, this.generateSampleSrc(maxTextures));
      this.programCache[maxTextures] = new Program(this.vertexSrc, fragmentSrc);
    }
    var uniforms = {
      tint: new Float32Array([1, 1, 1, 1]),
      translationMatrix: new Matrix(),
      default: this.defaultGroupCache[maxTextures]
    };
    return new Shader(this.programCache[maxTextures], uniforms);
  };
  BatchShaderGenerator2.prototype.generateSampleSrc = function(maxTextures) {
    var src = "";
    src += "\n";
    src += "\n";
    for (var i = 0; i < maxTextures; i++) {
      if (i > 0) {
        src += "\nelse ";
      }
      if (i < maxTextures - 1) {
        src += "if(vTextureId < " + i + ".5)";
      }
      src += "\n{";
      src += "\n	color = texture2D(uSamplers[" + i + "], vTextureCoord);";
      src += "\n}";
    }
    src += "\n";
    src += "\n";
    return src;
  };
  return BatchShaderGenerator2;
}();
var BatchGeometry = function(_super) {
  __extends(BatchGeometry2, _super);
  function BatchGeometry2(_static) {
    if (_static === void 0) {
      _static = false;
    }
    var _this = _super.call(this) || this;
    _this._buffer = new Buffer2(null, _static, false);
    _this._indexBuffer = new Buffer2(null, _static, true);
    _this.addAttribute("aVertexPosition", _this._buffer, 2, false, TYPES.FLOAT).addAttribute("aTextureCoord", _this._buffer, 2, false, TYPES.FLOAT).addAttribute("aColor", _this._buffer, 4, true, TYPES.UNSIGNED_BYTE).addAttribute("aTextureId", _this._buffer, 1, true, TYPES.FLOAT).addIndex(_this._indexBuffer);
    return _this;
  }
  return BatchGeometry2;
}(Geometry);
var defaultVertex = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n";
var defaultFragment = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n";
var BatchPluginFactory = function() {
  function BatchPluginFactory2() {
  }
  BatchPluginFactory2.create = function(options) {
    var _a = Object.assign({
      vertex: defaultVertex,
      fragment: defaultFragment,
      geometryClass: BatchGeometry,
      vertexSize: 6
    }, options), vertex2 = _a.vertex, fragment2 = _a.fragment, vertexSize = _a.vertexSize, geometryClass = _a.geometryClass;
    return function(_super) {
      __extends(BatchPlugin, _super);
      function BatchPlugin(renderer) {
        var _this = _super.call(this, renderer) || this;
        _this.shaderGenerator = new BatchShaderGenerator(vertex2, fragment2);
        _this.geometryClass = geometryClass;
        _this.vertexSize = vertexSize;
        return _this;
      }
      return BatchPlugin;
    }(AbstractBatchRenderer);
  };
  Object.defineProperty(BatchPluginFactory2, "defaultVertexSrc", {
    get: function() {
      return defaultVertex;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(BatchPluginFactory2, "defaultFragmentTemplate", {
    get: function() {
      return defaultFragment;
    },
    enumerable: false,
    configurable: true
  });
  return BatchPluginFactory2;
}();
var BatchRenderer = BatchPluginFactory.create();
Object.assign(BatchRenderer, {
  extension: {
    name: "batch",
    type: ExtensionType.RendererPlugin
  }
});
/*!
 * @pixi/loaders - v6.5.2
 * Compiled Wed, 24 Aug 2022 13:51:19 UTC
 *
 * @pixi/loaders is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var SignalBinding = function() {
  function SignalBinding2(fn, once, thisArg) {
    if (once === void 0) {
      once = false;
    }
    this._fn = fn;
    this._once = once;
    this._thisArg = thisArg;
    this._next = this._prev = this._owner = null;
  }
  SignalBinding2.prototype.detach = function() {
    if (this._owner === null) {
      return false;
    }
    this._owner.detach(this);
    return true;
  };
  return SignalBinding2;
}();
function _addSignalBinding(self2, node) {
  if (!self2._head) {
    self2._head = node;
    self2._tail = node;
  } else {
    self2._tail._next = node;
    node._prev = self2._tail;
    self2._tail = node;
  }
  node._owner = self2;
  return node;
}
var Signal = function() {
  function Signal2() {
    this._head = this._tail = void 0;
  }
  Signal2.prototype.handlers = function(exists) {
    if (exists === void 0) {
      exists = false;
    }
    var node = this._head;
    if (exists) {
      return !!node;
    }
    var ee = [];
    while (node) {
      ee.push(node);
      node = node._next;
    }
    return ee;
  };
  Signal2.prototype.has = function(node) {
    if (!(node instanceof SignalBinding)) {
      throw new Error("MiniSignal#has(): First arg must be a SignalBinding object.");
    }
    return node._owner === this;
  };
  Signal2.prototype.dispatch = function() {
    var arguments$1 = arguments;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments$1[_i];
    }
    var node = this._head;
    if (!node) {
      return false;
    }
    while (node) {
      if (node._once) {
        this.detach(node);
      }
      node._fn.apply(node._thisArg, args);
      node = node._next;
    }
    return true;
  };
  Signal2.prototype.add = function(fn, thisArg) {
    if (thisArg === void 0) {
      thisArg = null;
    }
    if (typeof fn !== "function") {
      throw new Error("MiniSignal#add(): First arg must be a Function.");
    }
    return _addSignalBinding(this, new SignalBinding(fn, false, thisArg));
  };
  Signal2.prototype.once = function(fn, thisArg) {
    if (thisArg === void 0) {
      thisArg = null;
    }
    if (typeof fn !== "function") {
      throw new Error("MiniSignal#once(): First arg must be a Function.");
    }
    return _addSignalBinding(this, new SignalBinding(fn, true, thisArg));
  };
  Signal2.prototype.detach = function(node) {
    if (!(node instanceof SignalBinding)) {
      throw new Error("MiniSignal#detach(): First arg must be a SignalBinding object.");
    }
    if (node._owner !== this) {
      return this;
    }
    if (node._prev) {
      node._prev._next = node._next;
    }
    if (node._next) {
      node._next._prev = node._prev;
    }
    if (node === this._head) {
      this._head = node._next;
      if (node._next === null) {
        this._tail = null;
      }
    } else if (node === this._tail) {
      this._tail = node._prev;
      this._tail._next = null;
    }
    node._owner = null;
    return this;
  };
  Signal2.prototype.detachAll = function() {
    var node = this._head;
    if (!node) {
      return this;
    }
    this._head = this._tail = null;
    while (node) {
      node._owner = null;
      node = node._next;
    }
    return this;
  };
  return Signal2;
}();
function parseUri(str, opts) {
  opts = opts || {};
  var o = {
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
      name: "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };
  var m2 = o.parser[opts.strictMode ? "strict" : "loose"].exec(str);
  var uri = {};
  var i = 14;
  while (i--) {
    uri[o.key[i]] = m2[i] || "";
  }
  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function(_t0, t1, t2) {
    if (t1) {
      uri[o.q.name][t1] = t2;
    }
  });
  return uri;
}
var useXdr;
var tempAnchor = null;
var STATUS_NONE = 0;
var STATUS_OK = 200;
var STATUS_EMPTY = 204;
var STATUS_IE_BUG_EMPTY = 1223;
var STATUS_TYPE_OK = 2;
function _noop$1() {
}
function setExtMap(map2, extname, val) {
  if (extname && extname.indexOf(".") === 0) {
    extname = extname.substring(1);
  }
  if (!extname) {
    return;
  }
  map2[extname] = val;
}
function reqType(xhr) {
  return xhr.toString().replace("object ", "");
}
var LoaderResource = function() {
  function LoaderResource2(name, url2, options) {
    this._dequeue = _noop$1;
    this._onLoadBinding = null;
    this._elementTimer = 0;
    this._boundComplete = null;
    this._boundOnError = null;
    this._boundOnProgress = null;
    this._boundOnTimeout = null;
    this._boundXhrOnError = null;
    this._boundXhrOnTimeout = null;
    this._boundXhrOnAbort = null;
    this._boundXhrOnLoad = null;
    if (typeof name !== "string" || typeof url2 !== "string") {
      throw new Error("Both name and url are required for constructing a resource.");
    }
    options = options || {};
    this._flags = 0;
    this._setFlag(LoaderResource2.STATUS_FLAGS.DATA_URL, url2.indexOf("data:") === 0);
    this.name = name;
    this.url = url2;
    this.extension = this._getExtension();
    this.data = null;
    this.crossOrigin = options.crossOrigin === true ? "anonymous" : options.crossOrigin;
    this.timeout = options.timeout || 0;
    this.loadType = options.loadType || this._determineLoadType();
    this.xhrType = options.xhrType;
    this.metadata = options.metadata || {};
    this.error = null;
    this.xhr = null;
    this.children = [];
    this.type = LoaderResource2.TYPE.UNKNOWN;
    this.progressChunk = 0;
    this._dequeue = _noop$1;
    this._onLoadBinding = null;
    this._elementTimer = 0;
    this._boundComplete = this.complete.bind(this);
    this._boundOnError = this._onError.bind(this);
    this._boundOnProgress = this._onProgress.bind(this);
    this._boundOnTimeout = this._onTimeout.bind(this);
    this._boundXhrOnError = this._xhrOnError.bind(this);
    this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this);
    this._boundXhrOnAbort = this._xhrOnAbort.bind(this);
    this._boundXhrOnLoad = this._xhrOnLoad.bind(this);
    this.onStart = new Signal();
    this.onProgress = new Signal();
    this.onComplete = new Signal();
    this.onAfterMiddleware = new Signal();
  }
  LoaderResource2.setExtensionLoadType = function(extname, loadType) {
    setExtMap(LoaderResource2._loadTypeMap, extname, loadType);
  };
  LoaderResource2.setExtensionXhrType = function(extname, xhrType) {
    setExtMap(LoaderResource2._xhrTypeMap, extname, xhrType);
  };
  Object.defineProperty(LoaderResource2.prototype, "isDataUrl", {
    get: function() {
      return this._hasFlag(LoaderResource2.STATUS_FLAGS.DATA_URL);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(LoaderResource2.prototype, "isComplete", {
    get: function() {
      return this._hasFlag(LoaderResource2.STATUS_FLAGS.COMPLETE);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(LoaderResource2.prototype, "isLoading", {
    get: function() {
      return this._hasFlag(LoaderResource2.STATUS_FLAGS.LOADING);
    },
    enumerable: false,
    configurable: true
  });
  LoaderResource2.prototype.complete = function() {
    this._clearEvents();
    this._finish();
  };
  LoaderResource2.prototype.abort = function(message) {
    if (this.error) {
      return;
    }
    this.error = new Error(message);
    this._clearEvents();
    if (this.xhr) {
      this.xhr.abort();
    } else if (this.xdr) {
      this.xdr.abort();
    } else if (this.data) {
      if (this.data.src) {
        this.data.src = LoaderResource2.EMPTY_GIF;
      } else {
        while (this.data.firstChild) {
          this.data.removeChild(this.data.firstChild);
        }
      }
    }
    this._finish();
  };
  LoaderResource2.prototype.load = function(cb) {
    var _this = this;
    if (this.isLoading) {
      return;
    }
    if (this.isComplete) {
      if (cb) {
        setTimeout(function() {
          return cb(_this);
        }, 1);
      }
      return;
    } else if (cb) {
      this.onComplete.once(cb);
    }
    this._setFlag(LoaderResource2.STATUS_FLAGS.LOADING, true);
    this.onStart.dispatch(this);
    if (this.crossOrigin === false || typeof this.crossOrigin !== "string") {
      this.crossOrigin = this._determineCrossOrigin(this.url);
    }
    switch (this.loadType) {
      case LoaderResource2.LOAD_TYPE.IMAGE:
        this.type = LoaderResource2.TYPE.IMAGE;
        this._loadElement("image");
        break;
      case LoaderResource2.LOAD_TYPE.AUDIO:
        this.type = LoaderResource2.TYPE.AUDIO;
        this._loadSourceElement("audio");
        break;
      case LoaderResource2.LOAD_TYPE.VIDEO:
        this.type = LoaderResource2.TYPE.VIDEO;
        this._loadSourceElement("video");
        break;
      case LoaderResource2.LOAD_TYPE.XHR:
      default:
        if (typeof useXdr === "undefined") {
          useXdr = !!(globalThis.XDomainRequest && !("withCredentials" in new XMLHttpRequest()));
        }
        if (useXdr && this.crossOrigin) {
          this._loadXdr();
        } else {
          this._loadXhr();
        }
        break;
    }
  };
  LoaderResource2.prototype._hasFlag = function(flag) {
    return (this._flags & flag) !== 0;
  };
  LoaderResource2.prototype._setFlag = function(flag, value) {
    this._flags = value ? this._flags | flag : this._flags & ~flag;
  };
  LoaderResource2.prototype._clearEvents = function() {
    clearTimeout(this._elementTimer);
    if (this.data && this.data.removeEventListener) {
      this.data.removeEventListener("error", this._boundOnError, false);
      this.data.removeEventListener("load", this._boundComplete, false);
      this.data.removeEventListener("progress", this._boundOnProgress, false);
      this.data.removeEventListener("canplaythrough", this._boundComplete, false);
    }
    if (this.xhr) {
      if (this.xhr.removeEventListener) {
        this.xhr.removeEventListener("error", this._boundXhrOnError, false);
        this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, false);
        this.xhr.removeEventListener("abort", this._boundXhrOnAbort, false);
        this.xhr.removeEventListener("progress", this._boundOnProgress, false);
        this.xhr.removeEventListener("load", this._boundXhrOnLoad, false);
      } else {
        this.xhr.onerror = null;
        this.xhr.ontimeout = null;
        this.xhr.onprogress = null;
        this.xhr.onload = null;
      }
    }
  };
  LoaderResource2.prototype._finish = function() {
    if (this.isComplete) {
      throw new Error("Complete called again for an already completed resource.");
    }
    this._setFlag(LoaderResource2.STATUS_FLAGS.COMPLETE, true);
    this._setFlag(LoaderResource2.STATUS_FLAGS.LOADING, false);
    this.onComplete.dispatch(this);
  };
  LoaderResource2.prototype._loadElement = function(type) {
    if (this.metadata.loadElement) {
      this.data = this.metadata.loadElement;
    } else if (type === "image" && typeof globalThis.Image !== "undefined") {
      this.data = new Image();
    } else {
      this.data = document.createElement(type);
    }
    if (this.crossOrigin) {
      this.data.crossOrigin = this.crossOrigin;
    }
    if (!this.metadata.skipSource) {
      this.data.src = this.url;
    }
    this.data.addEventListener("error", this._boundOnError, false);
    this.data.addEventListener("load", this._boundComplete, false);
    this.data.addEventListener("progress", this._boundOnProgress, false);
    if (this.timeout) {
      this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout);
    }
  };
  LoaderResource2.prototype._loadSourceElement = function(type) {
    if (this.metadata.loadElement) {
      this.data = this.metadata.loadElement;
    } else if (type === "audio" && typeof globalThis.Audio !== "undefined") {
      this.data = new Audio();
    } else {
      this.data = document.createElement(type);
    }
    if (this.data === null) {
      this.abort("Unsupported element: " + type);
      return;
    }
    if (this.crossOrigin) {
      this.data.crossOrigin = this.crossOrigin;
    }
    if (!this.metadata.skipSource) {
      if (navigator.isCocoonJS) {
        this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
      } else if (Array.isArray(this.url)) {
        var mimeTypes = this.metadata.mimeType;
        for (var i = 0; i < this.url.length; ++i) {
          this.data.appendChild(this._createSource(type, this.url[i], Array.isArray(mimeTypes) ? mimeTypes[i] : mimeTypes));
        }
      } else {
        var mimeTypes = this.metadata.mimeType;
        this.data.appendChild(this._createSource(type, this.url, Array.isArray(mimeTypes) ? mimeTypes[0] : mimeTypes));
      }
    }
    this.data.addEventListener("error", this._boundOnError, false);
    this.data.addEventListener("load", this._boundComplete, false);
    this.data.addEventListener("progress", this._boundOnProgress, false);
    this.data.addEventListener("canplaythrough", this._boundComplete, false);
    this.data.load();
    if (this.timeout) {
      this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout);
    }
  };
  LoaderResource2.prototype._loadXhr = function() {
    if (typeof this.xhrType !== "string") {
      this.xhrType = this._determineXhrType();
    }
    var xhr = this.xhr = new XMLHttpRequest();
    if (this.crossOrigin === "use-credentials") {
      xhr.withCredentials = true;
    }
    xhr.open("GET", this.url, true);
    xhr.timeout = this.timeout;
    if (this.xhrType === LoaderResource2.XHR_RESPONSE_TYPE.JSON || this.xhrType === LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT) {
      xhr.responseType = LoaderResource2.XHR_RESPONSE_TYPE.TEXT;
    } else {
      xhr.responseType = this.xhrType;
    }
    xhr.addEventListener("error", this._boundXhrOnError, false);
    xhr.addEventListener("timeout", this._boundXhrOnTimeout, false);
    xhr.addEventListener("abort", this._boundXhrOnAbort, false);
    xhr.addEventListener("progress", this._boundOnProgress, false);
    xhr.addEventListener("load", this._boundXhrOnLoad, false);
    xhr.send();
  };
  LoaderResource2.prototype._loadXdr = function() {
    if (typeof this.xhrType !== "string") {
      this.xhrType = this._determineXhrType();
    }
    var xdr = this.xhr = new globalThis.XDomainRequest();
    xdr.timeout = this.timeout || 5e3;
    xdr.onerror = this._boundXhrOnError;
    xdr.ontimeout = this._boundXhrOnTimeout;
    xdr.onprogress = this._boundOnProgress;
    xdr.onload = this._boundXhrOnLoad;
    xdr.open("GET", this.url, true);
    setTimeout(function() {
      return xdr.send();
    }, 1);
  };
  LoaderResource2.prototype._createSource = function(type, url2, mime) {
    if (!mime) {
      mime = type + "/" + this._getExtension(url2);
    }
    var source = document.createElement("source");
    source.src = url2;
    source.type = mime;
    return source;
  };
  LoaderResource2.prototype._onError = function(event) {
    this.abort("Failed to load element using: " + event.target.nodeName);
  };
  LoaderResource2.prototype._onProgress = function(event) {
    if (event && event.lengthComputable) {
      this.onProgress.dispatch(this, event.loaded / event.total);
    }
  };
  LoaderResource2.prototype._onTimeout = function() {
    this.abort("Load timed out.");
  };
  LoaderResource2.prototype._xhrOnError = function() {
    var xhr = this.xhr;
    this.abort(reqType(xhr) + " Request failed. Status: " + xhr.status + ', text: "' + xhr.statusText + '"');
  };
  LoaderResource2.prototype._xhrOnTimeout = function() {
    var xhr = this.xhr;
    this.abort(reqType(xhr) + " Request timed out.");
  };
  LoaderResource2.prototype._xhrOnAbort = function() {
    var xhr = this.xhr;
    this.abort(reqType(xhr) + " Request was aborted by the user.");
  };
  LoaderResource2.prototype._xhrOnLoad = function() {
    var xhr = this.xhr;
    var text = "";
    var status = typeof xhr.status === "undefined" ? STATUS_OK : xhr.status;
    if (xhr.responseType === "" || xhr.responseType === "text" || typeof xhr.responseType === "undefined") {
      text = xhr.responseText;
    }
    if (status === STATUS_NONE && (text.length > 0 || xhr.responseType === LoaderResource2.XHR_RESPONSE_TYPE.BUFFER)) {
      status = STATUS_OK;
    } else if (status === STATUS_IE_BUG_EMPTY) {
      status = STATUS_EMPTY;
    }
    var statusType = status / 100 | 0;
    if (statusType === STATUS_TYPE_OK) {
      if (this.xhrType === LoaderResource2.XHR_RESPONSE_TYPE.TEXT) {
        this.data = text;
        this.type = LoaderResource2.TYPE.TEXT;
      } else if (this.xhrType === LoaderResource2.XHR_RESPONSE_TYPE.JSON) {
        try {
          this.data = JSON.parse(text);
          this.type = LoaderResource2.TYPE.JSON;
        } catch (e) {
          this.abort("Error trying to parse loaded json: " + e);
          return;
        }
      } else if (this.xhrType === LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT) {
        try {
          if (globalThis.DOMParser) {
            var domparser = new DOMParser();
            this.data = domparser.parseFromString(text, "text/xml");
          } else {
            var div = document.createElement("div");
            div.innerHTML = text;
            this.data = div;
          }
          this.type = LoaderResource2.TYPE.XML;
        } catch (e$1) {
          this.abort("Error trying to parse loaded xml: " + e$1);
          return;
        }
      } else {
        this.data = xhr.response || text;
      }
    } else {
      this.abort("[" + xhr.status + "] " + xhr.statusText + ": " + xhr.responseURL);
      return;
    }
    this.complete();
  };
  LoaderResource2.prototype._determineCrossOrigin = function(url2, loc) {
    if (url2.indexOf("data:") === 0) {
      return "";
    }
    if (globalThis.origin !== globalThis.location.origin) {
      return "anonymous";
    }
    loc = loc || globalThis.location;
    if (!tempAnchor) {
      tempAnchor = document.createElement("a");
    }
    tempAnchor.href = url2;
    var parsedUrl = parseUri(tempAnchor.href, { strictMode: true });
    var samePort = !parsedUrl.port && loc.port === "" || parsedUrl.port === loc.port;
    var protocol = parsedUrl.protocol ? parsedUrl.protocol + ":" : "";
    if (parsedUrl.host !== loc.hostname || !samePort || protocol !== loc.protocol) {
      return "anonymous";
    }
    return "";
  };
  LoaderResource2.prototype._determineXhrType = function() {
    return LoaderResource2._xhrTypeMap[this.extension] || LoaderResource2.XHR_RESPONSE_TYPE.TEXT;
  };
  LoaderResource2.prototype._determineLoadType = function() {
    return LoaderResource2._loadTypeMap[this.extension] || LoaderResource2.LOAD_TYPE.XHR;
  };
  LoaderResource2.prototype._getExtension = function(url2) {
    if (url2 === void 0) {
      url2 = this.url;
    }
    var ext = "";
    if (this.isDataUrl) {
      var slashIndex = url2.indexOf("/");
      ext = url2.substring(slashIndex + 1, url2.indexOf(";", slashIndex));
    } else {
      var queryStart = url2.indexOf("?");
      var hashStart = url2.indexOf("#");
      var index = Math.min(queryStart > -1 ? queryStart : url2.length, hashStart > -1 ? hashStart : url2.length);
      url2 = url2.substring(0, index);
      ext = url2.substring(url2.lastIndexOf(".") + 1);
    }
    return ext.toLowerCase();
  };
  LoaderResource2.prototype._getMimeFromXhrType = function(type) {
    switch (type) {
      case LoaderResource2.XHR_RESPONSE_TYPE.BUFFER:
        return "application/octet-binary";
      case LoaderResource2.XHR_RESPONSE_TYPE.BLOB:
        return "application/blob";
      case LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT:
        return "application/xml";
      case LoaderResource2.XHR_RESPONSE_TYPE.JSON:
        return "application/json";
      case LoaderResource2.XHR_RESPONSE_TYPE.DEFAULT:
      case LoaderResource2.XHR_RESPONSE_TYPE.TEXT:
      default:
        return "text/plain";
    }
  };
  return LoaderResource2;
}();
(function(LoaderResource2) {
  (function(STATUS_FLAGS) {
    STATUS_FLAGS[STATUS_FLAGS["NONE"] = 0] = "NONE";
    STATUS_FLAGS[STATUS_FLAGS["DATA_URL"] = 1] = "DATA_URL";
    STATUS_FLAGS[STATUS_FLAGS["COMPLETE"] = 2] = "COMPLETE";
    STATUS_FLAGS[STATUS_FLAGS["LOADING"] = 4] = "LOADING";
  })(LoaderResource2.STATUS_FLAGS || (LoaderResource2.STATUS_FLAGS = {}));
  (function(TYPE) {
    TYPE[TYPE["UNKNOWN"] = 0] = "UNKNOWN";
    TYPE[TYPE["JSON"] = 1] = "JSON";
    TYPE[TYPE["XML"] = 2] = "XML";
    TYPE[TYPE["IMAGE"] = 3] = "IMAGE";
    TYPE[TYPE["AUDIO"] = 4] = "AUDIO";
    TYPE[TYPE["VIDEO"] = 5] = "VIDEO";
    TYPE[TYPE["TEXT"] = 6] = "TEXT";
  })(LoaderResource2.TYPE || (LoaderResource2.TYPE = {}));
  (function(LOAD_TYPE) {
    LOAD_TYPE[LOAD_TYPE["XHR"] = 1] = "XHR";
    LOAD_TYPE[LOAD_TYPE["IMAGE"] = 2] = "IMAGE";
    LOAD_TYPE[LOAD_TYPE["AUDIO"] = 3] = "AUDIO";
    LOAD_TYPE[LOAD_TYPE["VIDEO"] = 4] = "VIDEO";
  })(LoaderResource2.LOAD_TYPE || (LoaderResource2.LOAD_TYPE = {}));
  (function(XHR_RESPONSE_TYPE) {
    XHR_RESPONSE_TYPE["DEFAULT"] = "text";
    XHR_RESPONSE_TYPE["BUFFER"] = "arraybuffer";
    XHR_RESPONSE_TYPE["BLOB"] = "blob";
    XHR_RESPONSE_TYPE["DOCUMENT"] = "document";
    XHR_RESPONSE_TYPE["JSON"] = "json";
    XHR_RESPONSE_TYPE["TEXT"] = "text";
  })(LoaderResource2.XHR_RESPONSE_TYPE || (LoaderResource2.XHR_RESPONSE_TYPE = {}));
  LoaderResource2._loadTypeMap = {
    gif: LoaderResource2.LOAD_TYPE.IMAGE,
    png: LoaderResource2.LOAD_TYPE.IMAGE,
    bmp: LoaderResource2.LOAD_TYPE.IMAGE,
    jpg: LoaderResource2.LOAD_TYPE.IMAGE,
    jpeg: LoaderResource2.LOAD_TYPE.IMAGE,
    tif: LoaderResource2.LOAD_TYPE.IMAGE,
    tiff: LoaderResource2.LOAD_TYPE.IMAGE,
    webp: LoaderResource2.LOAD_TYPE.IMAGE,
    tga: LoaderResource2.LOAD_TYPE.IMAGE,
    svg: LoaderResource2.LOAD_TYPE.IMAGE,
    "svg+xml": LoaderResource2.LOAD_TYPE.IMAGE,
    mp3: LoaderResource2.LOAD_TYPE.AUDIO,
    ogg: LoaderResource2.LOAD_TYPE.AUDIO,
    wav: LoaderResource2.LOAD_TYPE.AUDIO,
    mp4: LoaderResource2.LOAD_TYPE.VIDEO,
    webm: LoaderResource2.LOAD_TYPE.VIDEO
  };
  LoaderResource2._xhrTypeMap = {
    xhtml: LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT,
    html: LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT,
    htm: LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT,
    xml: LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT,
    tmx: LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT,
    svg: LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT,
    tsx: LoaderResource2.XHR_RESPONSE_TYPE.DOCUMENT,
    gif: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    png: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    bmp: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    jpg: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    jpeg: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    tif: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    tiff: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    webp: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    tga: LoaderResource2.XHR_RESPONSE_TYPE.BLOB,
    json: LoaderResource2.XHR_RESPONSE_TYPE.JSON,
    text: LoaderResource2.XHR_RESPONSE_TYPE.TEXT,
    txt: LoaderResource2.XHR_RESPONSE_TYPE.TEXT,
    ttf: LoaderResource2.XHR_RESPONSE_TYPE.BUFFER,
    otf: LoaderResource2.XHR_RESPONSE_TYPE.BUFFER
  };
  LoaderResource2.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
})(LoaderResource || (LoaderResource = {}));
function _noop() {
}
function onlyOnce(fn) {
  return function onceWrapper() {
    var arguments$1 = arguments;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments$1[_i];
    }
    if (fn === null) {
      throw new Error("Callback was already called.");
    }
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  };
}
var AsyncQueueItem = function() {
  function AsyncQueueItem2(data, callback) {
    this.data = data;
    this.callback = callback;
  }
  return AsyncQueueItem2;
}();
var AsyncQueue = function() {
  function AsyncQueue2(worker, concurrency) {
    var _this = this;
    if (concurrency === void 0) {
      concurrency = 1;
    }
    this.workers = 0;
    this.saturated = _noop;
    this.unsaturated = _noop;
    this.empty = _noop;
    this.drain = _noop;
    this.error = _noop;
    this.started = false;
    this.paused = false;
    this._tasks = [];
    this._insert = function(data, insertAtFront, callback) {
      if (callback && typeof callback !== "function") {
        throw new Error("task callback must be a function");
      }
      _this.started = true;
      if (data == null && _this.idle()) {
        setTimeout(function() {
          return _this.drain();
        }, 1);
        return;
      }
      var item = new AsyncQueueItem(data, typeof callback === "function" ? callback : _noop);
      if (insertAtFront) {
        _this._tasks.unshift(item);
      } else {
        _this._tasks.push(item);
      }
      setTimeout(_this.process, 1);
    };
    this.process = function() {
      while (!_this.paused && _this.workers < _this.concurrency && _this._tasks.length) {
        var task = _this._tasks.shift();
        if (_this._tasks.length === 0) {
          _this.empty();
        }
        _this.workers += 1;
        if (_this.workers === _this.concurrency) {
          _this.saturated();
        }
        _this._worker(task.data, onlyOnce(_this._next(task)));
      }
    };
    this._worker = worker;
    if (concurrency === 0) {
      throw new Error("Concurrency must not be zero");
    }
    this.concurrency = concurrency;
    this.buffer = concurrency / 4;
  }
  AsyncQueue2.prototype._next = function(task) {
    var _this = this;
    return function() {
      var arguments$1 = arguments;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments$1[_i];
      }
      _this.workers -= 1;
      task.callback.apply(task, args);
      if (args[0] != null) {
        _this.error(args[0], task.data);
      }
      if (_this.workers <= _this.concurrency - _this.buffer) {
        _this.unsaturated();
      }
      if (_this.idle()) {
        _this.drain();
      }
      _this.process();
    };
  };
  AsyncQueue2.prototype.push = function(data, callback) {
    this._insert(data, false, callback);
  };
  AsyncQueue2.prototype.kill = function() {
    this.workers = 0;
    this.drain = _noop;
    this.started = false;
    this._tasks = [];
  };
  AsyncQueue2.prototype.unshift = function(data, callback) {
    this._insert(data, true, callback);
  };
  AsyncQueue2.prototype.length = function() {
    return this._tasks.length;
  };
  AsyncQueue2.prototype.running = function() {
    return this.workers;
  };
  AsyncQueue2.prototype.idle = function() {
    return this._tasks.length + this.workers === 0;
  };
  AsyncQueue2.prototype.pause = function() {
    if (this.paused === true) {
      return;
    }
    this.paused = true;
  };
  AsyncQueue2.prototype.resume = function() {
    if (this.paused === false) {
      return;
    }
    this.paused = false;
    for (var w2 = 1; w2 <= this.concurrency; w2++) {
      this.process();
    }
  };
  AsyncQueue2.eachSeries = function(array, iterator, callback, deferNext) {
    var i = 0;
    var len = array.length;
    function next(err) {
      if (err || i === len) {
        if (callback) {
          callback(err);
        }
        return;
      }
      if (deferNext) {
        setTimeout(function() {
          iterator(array[i++], next);
        }, 1);
      } else {
        iterator(array[i++], next);
      }
    }
    next();
  };
  AsyncQueue2.queue = function(worker, concurrency) {
    return new AsyncQueue2(worker, concurrency);
  };
  return AsyncQueue2;
}();
var MAX_PROGRESS = 100;
var rgxExtractUrlHash = /(#[\w-]+)?$/;
var Loader = function() {
  function Loader2(baseUrl, concurrency) {
    var _this = this;
    if (baseUrl === void 0) {
      baseUrl = "";
    }
    if (concurrency === void 0) {
      concurrency = 10;
    }
    this.progress = 0;
    this.loading = false;
    this.defaultQueryString = "";
    this._beforeMiddleware = [];
    this._afterMiddleware = [];
    this._resourcesParsing = [];
    this._boundLoadResource = function(r2, d2) {
      return _this._loadResource(r2, d2);
    };
    this.resources = {};
    this.baseUrl = baseUrl;
    this._beforeMiddleware = [];
    this._afterMiddleware = [];
    this._resourcesParsing = [];
    this._boundLoadResource = function(r2, d2) {
      return _this._loadResource(r2, d2);
    };
    this._queue = AsyncQueue.queue(this._boundLoadResource, concurrency);
    this._queue.pause();
    this.resources = {};
    this.onProgress = new Signal();
    this.onError = new Signal();
    this.onLoad = new Signal();
    this.onStart = new Signal();
    this.onComplete = new Signal();
    for (var i = 0; i < Loader2._plugins.length; ++i) {
      var plugin = Loader2._plugins[i];
      var pre = plugin.pre, use = plugin.use;
      if (pre) {
        this.pre(pre);
      }
      if (use) {
        this.use(use);
      }
    }
    this._protected = false;
  }
  Loader2.prototype._add = function(name, url2, options, callback) {
    if (this.loading && (!options || !options.parentResource)) {
      throw new Error("Cannot add resources while the loader is running.");
    }
    if (this.resources[name]) {
      throw new Error('Resource named "' + name + '" already exists.');
    }
    url2 = this._prepareUrl(url2);
    this.resources[name] = new LoaderResource(name, url2, options);
    if (typeof callback === "function") {
      this.resources[name].onAfterMiddleware.once(callback);
    }
    if (this.loading) {
      var parent = options.parentResource;
      var incompleteChildren = [];
      for (var i = 0; i < parent.children.length; ++i) {
        if (!parent.children[i].isComplete) {
          incompleteChildren.push(parent.children[i]);
        }
      }
      var fullChunk = parent.progressChunk * (incompleteChildren.length + 1);
      var eachChunk = fullChunk / (incompleteChildren.length + 2);
      parent.children.push(this.resources[name]);
      parent.progressChunk = eachChunk;
      for (var i = 0; i < incompleteChildren.length; ++i) {
        incompleteChildren[i].progressChunk = eachChunk;
      }
      this.resources[name].progressChunk = eachChunk;
    }
    this._queue.push(this.resources[name]);
    return this;
  };
  Loader2.prototype.pre = function(fn) {
    this._beforeMiddleware.push(fn);
    return this;
  };
  Loader2.prototype.use = function(fn) {
    this._afterMiddleware.push(fn);
    return this;
  };
  Loader2.prototype.reset = function() {
    this.progress = 0;
    this.loading = false;
    this._queue.kill();
    this._queue.pause();
    for (var k in this.resources) {
      var res = this.resources[k];
      if (res._onLoadBinding) {
        res._onLoadBinding.detach();
      }
      if (res.isLoading) {
        res.abort("loader reset");
      }
    }
    this.resources = {};
    return this;
  };
  Loader2.prototype.load = function(cb) {
    deprecation("6.5.0", "@pixi/loaders is being replaced with @pixi/assets in the next major release.");
    if (typeof cb === "function") {
      this.onComplete.once(cb);
    }
    if (this.loading) {
      return this;
    }
    if (this._queue.idle()) {
      this._onStart();
      this._onComplete();
    } else {
      var numTasks = this._queue._tasks.length;
      var chunk = MAX_PROGRESS / numTasks;
      for (var i = 0; i < this._queue._tasks.length; ++i) {
        this._queue._tasks[i].data.progressChunk = chunk;
      }
      this._onStart();
      this._queue.resume();
    }
    return this;
  };
  Object.defineProperty(Loader2.prototype, "concurrency", {
    get: function() {
      return this._queue.concurrency;
    },
    set: function(concurrency) {
      this._queue.concurrency = concurrency;
    },
    enumerable: false,
    configurable: true
  });
  Loader2.prototype._prepareUrl = function(url2) {
    var parsedUrl = parseUri(url2, { strictMode: true });
    var result;
    if (parsedUrl.protocol || !parsedUrl.path || url2.indexOf("//") === 0) {
      result = url2;
    } else if (this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && url2.charAt(0) !== "/") {
      result = this.baseUrl + "/" + url2;
    } else {
      result = this.baseUrl + url2;
    }
    if (this.defaultQueryString) {
      var hash = rgxExtractUrlHash.exec(result)[0];
      result = result.slice(0, result.length - hash.length);
      if (result.indexOf("?") !== -1) {
        result += "&" + this.defaultQueryString;
      } else {
        result += "?" + this.defaultQueryString;
      }
      result += hash;
    }
    return result;
  };
  Loader2.prototype._loadResource = function(resource, dequeue) {
    var _this = this;
    resource._dequeue = dequeue;
    AsyncQueue.eachSeries(this._beforeMiddleware, function(fn, next) {
      fn.call(_this, resource, function() {
        next(resource.isComplete ? {} : null);
      });
    }, function() {
      if (resource.isComplete) {
        _this._onLoad(resource);
      } else {
        resource._onLoadBinding = resource.onComplete.once(_this._onLoad, _this);
        resource.load();
      }
    }, true);
  };
  Loader2.prototype._onStart = function() {
    this.progress = 0;
    this.loading = true;
    this.onStart.dispatch(this);
  };
  Loader2.prototype._onComplete = function() {
    this.progress = MAX_PROGRESS;
    this.loading = false;
    this.onComplete.dispatch(this, this.resources);
  };
  Loader2.prototype._onLoad = function(resource) {
    var _this = this;
    resource._onLoadBinding = null;
    this._resourcesParsing.push(resource);
    resource._dequeue();
    AsyncQueue.eachSeries(this._afterMiddleware, function(fn, next) {
      fn.call(_this, resource, next);
    }, function() {
      resource.onAfterMiddleware.dispatch(resource);
      _this.progress = Math.min(MAX_PROGRESS, _this.progress + resource.progressChunk);
      _this.onProgress.dispatch(_this, resource);
      if (resource.error) {
        _this.onError.dispatch(resource.error, _this, resource);
      } else {
        _this.onLoad.dispatch(_this, resource);
      }
      _this._resourcesParsing.splice(_this._resourcesParsing.indexOf(resource), 1);
      if (_this._queue.idle() && _this._resourcesParsing.length === 0) {
        _this._onComplete();
      }
    }, true);
  };
  Loader2.prototype.destroy = function() {
    if (!this._protected) {
      this.reset();
    }
  };
  Object.defineProperty(Loader2, "shared", {
    get: function() {
      var shared = Loader2._shared;
      if (!shared) {
        shared = new Loader2();
        shared._protected = true;
        Loader2._shared = shared;
      }
      return shared;
    },
    enumerable: false,
    configurable: true
  });
  Loader2.registerPlugin = function(plugin) {
    deprecation("6.5.0", "Loader.registerPlugin() is deprecated, use extensions.add() instead.");
    extensions.add({
      type: ExtensionType.Loader,
      ref: plugin
    });
    return Loader2;
  };
  Loader2._plugins = [];
  return Loader2;
}();
extensions.handleByList(ExtensionType.Loader, Loader._plugins);
Loader.prototype.add = function add(name, url2, options, callback) {
  if (Array.isArray(name)) {
    for (var i = 0; i < name.length; ++i) {
      this.add(name[i]);
    }
    return this;
  }
  if (typeof name === "object") {
    options = name;
    callback = url2 || options.callback || options.onComplete;
    url2 = options.url;
    name = options.name || options.key || options.url;
  }
  if (typeof url2 !== "string") {
    callback = options;
    options = url2;
    url2 = name;
  }
  if (typeof url2 !== "string") {
    throw new Error("No url passed to add resource to loader.");
  }
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  return this._add(name, url2, options, callback);
};
(function() {
  function AppLoaderPlugin() {
  }
  AppLoaderPlugin.init = function(options) {
    options = Object.assign({
      sharedLoader: false
    }, options);
    this.loader = options.sharedLoader ? Loader.shared : new Loader();
  };
  AppLoaderPlugin.destroy = function() {
    if (this.loader) {
      this.loader.destroy();
      this.loader = null;
    }
  };
  AppLoaderPlugin.extension = ExtensionType.Application;
  return AppLoaderPlugin;
})();
var TextureLoader = function() {
  function TextureLoader2() {
  }
  TextureLoader2.add = function() {
    LoaderResource.setExtensionLoadType("svg", LoaderResource.LOAD_TYPE.XHR);
    LoaderResource.setExtensionXhrType("svg", LoaderResource.XHR_RESPONSE_TYPE.TEXT);
  };
  TextureLoader2.use = function(resource, next) {
    if (resource.data && (resource.type === LoaderResource.TYPE.IMAGE || resource.extension === "svg")) {
      var data = resource.data, url2 = resource.url, name = resource.name, metadata = resource.metadata;
      Texture.fromLoader(data, url2, name, metadata).then(function(texture) {
        resource.texture = texture;
        next();
      }).catch(next);
    } else {
      next();
    }
  };
  TextureLoader2.extension = ExtensionType.Loader;
  return TextureLoader2;
}();
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function encodeBinary(input) {
  var output = "";
  var inx = 0;
  while (inx < input.length) {
    var bytebuffer = [0, 0, 0];
    var encodedCharIndexes = [0, 0, 0, 0];
    for (var jnx = 0; jnx < bytebuffer.length; ++jnx) {
      if (inx < input.length) {
        bytebuffer[jnx] = input.charCodeAt(inx++) & 255;
      } else {
        bytebuffer[jnx] = 0;
      }
    }
    encodedCharIndexes[0] = bytebuffer[0] >> 2;
    encodedCharIndexes[1] = (bytebuffer[0] & 3) << 4 | bytebuffer[1] >> 4;
    encodedCharIndexes[2] = (bytebuffer[1] & 15) << 2 | bytebuffer[2] >> 6;
    encodedCharIndexes[3] = bytebuffer[2] & 63;
    var paddingBytes = inx - (input.length - 1);
    switch (paddingBytes) {
      case 2:
        encodedCharIndexes[3] = 64;
        encodedCharIndexes[2] = 64;
        break;
      case 1:
        encodedCharIndexes[3] = 64;
        break;
    }
    for (var jnx = 0; jnx < encodedCharIndexes.length; ++jnx) {
      output += _keyStr.charAt(encodedCharIndexes[jnx]);
    }
  }
  return output;
}
function parsing(resource, next) {
  if (!resource.data) {
    next();
    return;
  }
  if (resource.xhr && resource.xhrType === LoaderResource.XHR_RESPONSE_TYPE.BLOB) {
    if (!self.Blob || typeof resource.data === "string") {
      var type = resource.xhr.getResponseHeader("content-type");
      if (type && type.indexOf("image") === 0) {
        resource.data = new Image();
        resource.data.src = "data:" + type + ";base64," + encodeBinary(resource.xhr.responseText);
        resource.type = LoaderResource.TYPE.IMAGE;
        resource.data.onload = function() {
          resource.data.onload = null;
          next();
        };
        return;
      }
    } else if (resource.data.type.indexOf("image") === 0) {
      var Url_1 = globalThis.URL || globalThis.webkitURL;
      var src_1 = Url_1.createObjectURL(resource.data);
      resource.blob = resource.data;
      resource.data = new Image();
      resource.data.src = src_1;
      resource.type = LoaderResource.TYPE.IMAGE;
      resource.data.onload = function() {
        Url_1.revokeObjectURL(src_1);
        resource.data.onload = null;
        next();
      };
      return;
    }
  }
  next();
}
var ParsingLoader = function() {
  function ParsingLoader2() {
  }
  ParsingLoader2.extension = ExtensionType.Loader;
  ParsingLoader2.use = parsing;
  return ParsingLoader2;
}();
extensions.add(TextureLoader, ParsingLoader);
/*!
 * @pixi/sound - v4.3.0
 * https://github.com/pixijs/pixi-sound
 * Compiled Fri, 05 Aug 2022 20:12:47 UTC
 *
 * @pixi/sound is licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license
 */
var r;
function s() {
  return r;
}
var u = function(t, e) {
  return (u = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t2, e2) {
    t2.__proto__ = e2;
  } || function(t2, e2) {
    for (var n2 in e2)
      Object.prototype.hasOwnProperty.call(e2, n2) && (t2[n2] = e2[n2]);
  })(t, e);
};
function a(t, e) {
  if ("function" != typeof e && null !== e)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  function n2() {
    this.constructor = t;
  }
  u(t, e), t.prototype = null === e ? Object.create(e) : (n2.prototype = e.prototype, new n2());
}
var c = function() {
  return (c = Object.assign || function(t) {
    for (var e, n2 = 1, o = arguments.length; n2 < o; n2++)
      for (var i in e = arguments[n2])
        Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
    return t;
  }).apply(this, arguments);
}, l = ["mp3", "ogg", "oga", "opus", "mpeg", "wav", "m4a", "aiff", "wma", "mid", "caf"], p = {};
function h(t) {
  var e = c({ m4a: "audio/mp4", oga: "audio/ogg", opus: 'audio/ogg; codecs="opus"', caf: 'audio/x-caf; codecs="opus"' }, t || {}), n2 = document.createElement("audio"), o = {}, i = /^no$/;
  l.forEach(function(t2) {
    var r2 = n2.canPlayType("audio/".concat(t2)).replace(i, ""), s2 = e[t2] ? n2.canPlayType(e[t2]).replace(i, "") : "";
    o[t2] = !!r2 || !!s2;
  }), Object.assign(p, o);
}
h();
var f = /\.(\{([^\}]+)\})(\?.*)?$/;
function d(t) {
  var e = f, n2 = "string" == typeof t ? t : t.url;
  if (!e.test(n2))
    return n2;
  for (var o = e.exec(n2), i = o[2].split(","), r2 = i[i.length - 1], s2 = 0, u2 = i.length; s2 < u2; s2++) {
    var a2 = i[s2];
    if (p[a2]) {
      r2 = a2;
      break;
    }
  }
  var c2 = n2.replace(o[1], r2);
  if ("string" != typeof t) {
    var l2 = t;
    l2.extension = r2, l2.url = c2;
  }
  return c2;
}
var _ = function() {
  function e() {
  }
  return e.add = function() {
    e.setLegacy(s().useLegacy);
  }, e.setLegacy = function(e2) {
    var n2 = l;
    e2 ? n2.forEach(function(e3) {
      LoaderResource.setExtensionXhrType(e3, LoaderResource.XHR_RESPONSE_TYPE.DEFAULT), LoaderResource.setExtensionLoadType(e3, LoaderResource.LOAD_TYPE.AUDIO);
    }) : n2.forEach(function(e3) {
      LoaderResource.setExtensionXhrType(e3, LoaderResource.XHR_RESPONSE_TYPE.BUFFER), LoaderResource.setExtensionLoadType(e3, LoaderResource.LOAD_TYPE.XHR);
    });
  }, e.pre = function(t, e2) {
    d(t), e2();
  }, e.use = function(t, e2) {
    t.data && l.indexOf(t.extension) > -1 ? t.sound = s().add(t.name, { loaded: e2, preload: true, url: t.url, source: t.data }) : e2();
  }, e;
}(), y = 0, m = function(t) {
  function e(e2) {
    var n2 = t.call(this) || this;
    return n2.id = y++, n2.init(e2), n2;
  }
  return a(e, t), e.prototype.set = function(t2, e2) {
    if (void 0 === this[t2])
      throw new Error("Property with name ".concat(t2, " does not exist."));
    switch (t2) {
      case "speed":
        this.speed = e2;
        break;
      case "volume":
        this.volume = e2;
        break;
      case "paused":
        this.paused = e2;
        break;
      case "loop":
        this.loop = e2;
        break;
      case "muted":
        this.muted = e2;
    }
    return this;
  }, Object.defineProperty(e.prototype, "progress", { get: function() {
    return this._source.currentTime / this._duration;
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "paused", { get: function() {
    return this._paused;
  }, set: function(t2) {
    this._paused = t2, this.refreshPaused();
  }, enumerable: false, configurable: true }), e.prototype._onPlay = function() {
    this._playing = true;
  }, e.prototype._onPause = function() {
    this._playing = false;
  }, e.prototype.init = function(t2) {
    this._playing = false, this._duration = t2.source.duration;
    var e2 = this._source = t2.source.cloneNode(false);
    e2.src = t2.parent.url, e2.onplay = this._onPlay.bind(this), e2.onpause = this._onPause.bind(this), t2.context.on("refresh", this.refresh, this), t2.context.on("refreshPaused", this.refreshPaused, this), this._media = t2;
  }, e.prototype._internalStop = function() {
    this._source && this._playing && (this._source.onended = null, this._source.pause());
  }, e.prototype.stop = function() {
    this._internalStop(), this._source && this.emit("stop");
  }, Object.defineProperty(e.prototype, "speed", { get: function() {
    return this._speed;
  }, set: function(t2) {
    this._speed = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "volume", { get: function() {
    return this._volume;
  }, set: function(t2) {
    this._volume = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "loop", { get: function() {
    return this._loop;
  }, set: function(t2) {
    this._loop = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "muted", { get: function() {
    return this._muted;
  }, set: function(t2) {
    this._muted = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "filters", { get: function() {
    return null;
  }, set: function(t2) {
  }, enumerable: false, configurable: true }), e.prototype.refresh = function() {
    var t2 = this._media.context, e2 = this._media.parent;
    this._source.loop = this._loop || e2.loop;
    var n2 = t2.volume * (t2.muted ? 0 : 1), o = e2.volume * (e2.muted ? 0 : 1), i = this._volume * (this._muted ? 0 : 1);
    this._source.volume = i * n2 * o, this._source.playbackRate = this._speed * t2.speed * e2.speed;
  }, e.prototype.refreshPaused = function() {
    var t2 = this._media.context, e2 = this._media.parent, n2 = this._paused || e2.paused || t2.paused;
    n2 !== this._pausedReal && (this._pausedReal = n2, n2 ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({ start: this._source.currentTime, end: this._end, volume: this._volume, speed: this._speed, loop: this._loop })), this.emit("pause", n2));
  }, e.prototype.play = function(t2) {
    var n2 = this, i = t2.start, r2 = t2.end, s2 = t2.speed, u2 = t2.loop, a2 = t2.volume, c2 = t2.muted;
    this._speed = s2, this._volume = a2, this._loop = !!u2, this._muted = c2, this.refresh(), this.loop && null !== r2 && (this.loop = false), this._start = i, this._end = r2 || this._duration, this._start = Math.max(0, this._start - e.PADDING), this._end = Math.min(this._end + e.PADDING, this._duration), this._source.onloadedmetadata = function() {
      n2._source && (n2._source.currentTime = i, n2._source.onloadedmetadata = null, n2.emit("progress", i, n2._duration), Ticker.shared.add(n2._onUpdate, n2));
    }, this._source.onended = this._onComplete.bind(this), this._source.play(), this.emit("start");
  }, e.prototype._onUpdate = function() {
    this.emit("progress", this.progress, this._duration), this._source.currentTime >= this._end && !this._source.loop && this._onComplete();
  }, e.prototype._onComplete = function() {
    Ticker.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this);
  }, e.prototype.destroy = function() {
    Ticker.shared.remove(this._onUpdate, this), this.removeAllListeners();
    var t2 = this._source;
    t2 && (t2.onended = null, t2.onplay = null, t2.onpause = null, this._internalStop()), this._source = null, this._speed = 1, this._volume = 1, this._loop = false, this._end = null, this._start = 0, this._duration = 0, this._playing = false, this._pausedReal = false, this._paused = false, this._muted = false, this._media && (this._media.context.off("refresh", this.refresh, this), this._media.context.off("refreshPaused", this.refreshPaused, this), this._media = null);
  }, e.prototype.toString = function() {
    return "[HTMLAudioInstance id=".concat(this.id, "]");
  }, e.PADDING = 0.1, e;
}(n), g = function(t) {
  function e() {
    return null !== t && t.apply(this, arguments) || this;
  }
  return a(e, t), e.prototype.init = function(t2) {
    this.parent = t2, this._source = t2.options.source || new Audio(), t2.url && (this._source.src = t2.url);
  }, e.prototype.create = function() {
    return new m(this);
  }, Object.defineProperty(e.prototype, "isPlayable", { get: function() {
    return !!this._source && 4 === this._source.readyState;
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "duration", { get: function() {
    return this._source.duration;
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "context", { get: function() {
    return this.parent.context;
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "filters", { get: function() {
    return null;
  }, set: function(t2) {
  }, enumerable: false, configurable: true }), e.prototype.destroy = function() {
    this.removeAllListeners(), this.parent = null, this._source && (this._source.src = "", this._source.load(), this._source = null);
  }, Object.defineProperty(e.prototype, "source", { get: function() {
    return this._source;
  }, enumerable: false, configurable: true }), e.prototype.load = function(t2) {
    var e2 = this._source, n2 = this.parent;
    if (4 !== e2.readyState)
      if (n2.url) {
        e2.src = n2.url;
        var o = function() {
          s2(), n2.isLoaded = true;
          var e3 = n2.autoPlayStart();
          t2 && t2(null, n2, e3);
        }, i = function() {
          s2(), t2 && t2(new Error("Sound loading has been aborted"));
        }, r2 = function() {
          s2();
          var n3 = "Failed to load audio element (code: ".concat(e2.error.code, ")");
          t2 && t2(new Error(n3));
        }, s2 = function() {
          e2.removeEventListener("canplaythrough", o), e2.removeEventListener("load", o), e2.removeEventListener("abort", i), e2.removeEventListener("error", r2);
        };
        e2.addEventListener("canplaythrough", o, false), e2.addEventListener("load", o, false), e2.addEventListener("abort", i, false), e2.addEventListener("error", r2, false), e2.load();
      } else
        t2(new Error("sound.url or sound.source must be set"));
    else {
      n2.isLoaded = true;
      var u2 = n2.autoPlayStart();
      t2 && setTimeout(function() {
        t2(null, n2, u2);
      }, 0);
    }
  }, e;
}(n), b = function() {
  function t(t2, e) {
    this.parent = t2, Object.assign(this, e), this.duration = this.end - this.start;
  }
  return t.prototype.play = function(t2) {
    return this.parent.play({ complete: t2, speed: this.speed || this.parent.speed, end: this.end, start: this.start, loop: this.loop });
  }, t.prototype.destroy = function() {
    this.parent = null;
  }, t;
}(), v = function() {
  function t() {
  }
  return t.setParamValue = function(t2, e) {
    if (t2.setValueAtTime) {
      var n2 = s().context;
      t2.setValueAtTime(e, n2.audioContext.currentTime);
    } else
      t2.value = e;
    return e;
  }, t;
}(), P = 0, x = function(t) {
  function e(e2) {
    var n2 = t.call(this) || this;
    return n2.id = P++, n2._media = null, n2._paused = false, n2._muted = false, n2._elapsed = 0, n2.init(e2), n2;
  }
  return a(e, t), e.prototype.set = function(t2, e2) {
    if (void 0 === this[t2])
      throw new Error("Property with name ".concat(t2, " does not exist."));
    switch (t2) {
      case "speed":
        this.speed = e2;
        break;
      case "volume":
        this.volume = e2;
        break;
      case "muted":
        this.muted = e2;
        break;
      case "loop":
        this.loop = e2;
        break;
      case "paused":
        this.paused = e2;
    }
    return this;
  }, e.prototype.stop = function() {
    this._source && (this._internalStop(), this.emit("stop"));
  }, Object.defineProperty(e.prototype, "speed", { get: function() {
    return this._speed;
  }, set: function(t2) {
    this._speed = t2, this.refresh(), this._update(true);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "volume", { get: function() {
    return this._volume;
  }, set: function(t2) {
    this._volume = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "muted", { get: function() {
    return this._muted;
  }, set: function(t2) {
    this._muted = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "loop", { get: function() {
    return this._loop;
  }, set: function(t2) {
    this._loop = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "filters", { get: function() {
    return this._filters;
  }, set: function(t2) {
    var e2;
    this._filters && (null === (e2 = this._filters) || void 0 === e2 || e2.filter(function(t3) {
      return t3;
    }).forEach(function(t3) {
      return t3.disconnect();
    }), this._filters = null, this._source.connect(this._gain)), this._filters = (null == t2 ? void 0 : t2.length) ? t2.slice(0) : null, this.refresh();
  }, enumerable: false, configurable: true }), e.prototype.refresh = function() {
    if (this._source) {
      var t2 = this._media.context, e2 = this._media.parent;
      this._source.loop = this._loop || e2.loop;
      var n2 = t2.volume * (t2.muted ? 0 : 1), o = e2.volume * (e2.muted ? 0 : 1), i = this._volume * (this._muted ? 0 : 1);
      v.setParamValue(this._gain.gain, i * o * n2), v.setParamValue(this._source.playbackRate, this._speed * e2.speed * t2.speed), this.applyFilters();
    }
  }, e.prototype.applyFilters = function() {
    var t2;
    if (null === (t2 = this._filters) || void 0 === t2 ? void 0 : t2.length) {
      this._source.disconnect();
      var e2 = this._source;
      this._filters.forEach(function(t3) {
        e2.connect(t3.destination), e2 = t3;
      }), e2.connect(this._gain);
    }
  }, e.prototype.refreshPaused = function() {
    var t2 = this._media.context, e2 = this._media.parent, n2 = this._paused || e2.paused || t2.paused;
    n2 !== this._pausedReal && (this._pausedReal = n2, n2 ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({ start: this._elapsed % this._duration, end: this._end, speed: this._speed, loop: this._loop, volume: this._volume })), this.emit("pause", n2));
  }, e.prototype.play = function(t2) {
    var e2 = t2.start, n2 = t2.end, o = t2.speed, i = t2.loop, r2 = t2.volume, s2 = t2.muted, u2 = t2.filters;
    this._paused = false;
    var a2 = this._media.nodes.cloneBufferSource(), c2 = a2.source, l2 = a2.gain;
    this._source = c2, this._gain = l2, this._speed = o, this._volume = r2, this._loop = !!i, this._muted = s2, this._filters = u2, this.refresh();
    var p2 = this._source.buffer.duration;
    this._duration = p2, this._end = n2, this._lastUpdate = this._now(), this._elapsed = e2, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = n2, this._source.loopStart = e2, this._source.start(0, e2)) : n2 ? this._source.start(0, e2, n2 - e2) : this._source.start(0, e2), this.emit("start"), this._update(true), this.enableTicker(true);
  }, e.prototype.enableTicker = function(t2) {
    Ticker.shared.remove(this._updateListener, this), t2 && Ticker.shared.add(this._updateListener, this);
  }, Object.defineProperty(e.prototype, "progress", { get: function() {
    return this._progress;
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "paused", { get: function() {
    return this._paused;
  }, set: function(t2) {
    this._paused = t2, this.refreshPaused();
  }, enumerable: false, configurable: true }), e.prototype.destroy = function() {
    var t2;
    this.removeAllListeners(), this._internalStop(), this._gain && (this._gain.disconnect(), this._gain = null), this._media && (this._media.context.events.off("refresh", this.refresh, this), this._media.context.events.off("refreshPaused", this.refreshPaused, this), this._media = null), null === (t2 = this._filters) || void 0 === t2 || t2.forEach(function(t3) {
      return t3.disconnect();
    }), this._filters = null, this._end = null, this._speed = 1, this._volume = 1, this._loop = false, this._elapsed = 0, this._duration = 0, this._paused = false, this._muted = false, this._pausedReal = false;
  }, e.prototype.toString = function() {
    return "[WebAudioInstance id=".concat(this.id, "]");
  }, e.prototype._now = function() {
    return this._media.context.audioContext.currentTime;
  }, e.prototype._updateListener = function() {
    this._update();
  }, e.prototype._update = function(t2) {
    if (void 0 === t2 && (t2 = false), this._source) {
      var e2 = this._now(), n2 = e2 - this._lastUpdate;
      if (n2 > 0 || t2) {
        var o = this._source.playbackRate.value;
        this._elapsed += n2 * o, this._lastUpdate = e2;
        var i = this._duration, r2 = void 0;
        if (this._source.loopStart) {
          var s2 = this._source.loopEnd - this._source.loopStart;
          r2 = (this._source.loopStart + this._elapsed % s2) / i;
        } else
          r2 = this._elapsed % i / i;
        this._progress = r2, this.emit("progress", this._progress, i);
      }
    }
  }, e.prototype.init = function(t2) {
    this._media = t2, t2.context.events.on("refresh", this.refresh, this), t2.context.events.on("refreshPaused", this.refreshPaused, this);
  }, e.prototype._internalStop = function() {
    if (this._source) {
      this.enableTicker(false), this._source.onended = null, this._source.stop(0), this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t2) {
      }
      this._source = null;
    }
  }, e.prototype._onComplete = function() {
    if (this._source) {
      this.enableTicker(false), this._source.onended = null, this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t2) {
      }
    }
    this._source = null, this._progress = 1, this.emit("progress", 1, this._duration), this.emit("end", this);
  }, e;
}(n), O = function() {
  function t(t2, e) {
    this._output = e, this._input = t2;
  }
  return Object.defineProperty(t.prototype, "destination", { get: function() {
    return this._input;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "filters", { get: function() {
    return this._filters;
  }, set: function(t2) {
    var e = this;
    if (this._filters && (this._filters.forEach(function(t3) {
      t3 && t3.disconnect();
    }), this._filters = null, this._input.connect(this._output)), t2 && t2.length) {
      this._filters = t2.slice(0), this._input.disconnect();
      var n2 = null;
      t2.forEach(function(t3) {
        null === n2 ? e._input.connect(t3.destination) : n2.connect(t3.destination), n2 = t3;
      }), n2.connect(this._output);
    }
  }, enumerable: false, configurable: true }), t.prototype.destroy = function() {
    this.filters = null, this._input = null, this._output = null;
  }, t;
}(), j = function(t) {
  function e(e2) {
    var n2 = this, o = e2.audioContext, i = o.createBufferSource(), r2 = o.createGain(), s2 = o.createAnalyser();
    return i.connect(s2), s2.connect(r2), r2.connect(e2.destination), (n2 = t.call(this, s2, r2) || this).context = e2, n2.bufferSource = i, n2.gain = r2, n2.analyser = s2, n2;
  }
  return a(e, t), Object.defineProperty(e.prototype, "script", { get: function() {
    return this._script || (this._script = this.context.audioContext.createScriptProcessor(e.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
  }, enumerable: false, configurable: true }), e.prototype.destroy = function() {
    t.prototype.destroy.call(this), this.bufferSource.disconnect(), this._script && this._script.disconnect(), this.gain.disconnect(), this.analyser.disconnect(), this.bufferSource = null, this._script = null, this.gain = null, this.analyser = null, this.context = null;
  }, e.prototype.cloneBufferSource = function() {
    var t2 = this.bufferSource, e2 = this.context.audioContext.createBufferSource();
    e2.buffer = t2.buffer, v.setParamValue(e2.playbackRate, t2.playbackRate.value), e2.loop = t2.loop;
    var n2 = this.context.audioContext.createGain();
    return e2.connect(n2), n2.connect(this.destination), { source: e2, gain: n2 };
  }, Object.defineProperty(e.prototype, "bufferSize", { get: function() {
    return this.script.bufferSize;
  }, enumerable: false, configurable: true }), e.BUFFER_SIZE = 0, e;
}(O), w = function() {
  function t() {
  }
  return t.prototype.init = function(t2) {
    this.parent = t2, this._nodes = new j(this.context), this._source = this._nodes.bufferSource, this.source = t2.options.source;
  }, t.prototype.destroy = function() {
    this.parent = null, this._nodes.destroy(), this._nodes = null;
    try {
      this._source.buffer = null;
    } catch (t2) {
    }
    this._source = null, this.source = null;
  }, t.prototype.create = function() {
    return new x(this);
  }, Object.defineProperty(t.prototype, "context", { get: function() {
    return this.parent.context;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "isPlayable", { get: function() {
    return !!this._source && !!this._source.buffer;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "filters", { get: function() {
    return this._nodes.filters;
  }, set: function(t2) {
    this._nodes.filters = t2;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "duration", { get: function() {
    return this._source.buffer.duration;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "buffer", { get: function() {
    return this._source.buffer;
  }, set: function(t2) {
    this._source.buffer = t2;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "nodes", { get: function() {
    return this._nodes;
  }, enumerable: false, configurable: true }), t.prototype.load = function(t2) {
    this.source ? this._decode(this.source, t2) : this.parent.url ? this._loadUrl(t2) : t2 && t2(new Error("sound.url or sound.source must be set"));
  }, t.prototype._loadUrl = function(t2) {
    var e = this, n2 = new XMLHttpRequest(), o = this.parent.url;
    n2.open("GET", o, true), n2.responseType = "arraybuffer", n2.onload = function() {
      e.source = n2.response, e._decode(n2.response, t2);
    }, n2.send();
  }, t.prototype._decode = function(t2, e) {
    var n2 = this, o = function(t3, o2) {
      if (t3)
        e && e(t3);
      else {
        n2.parent.isLoaded = true, n2.buffer = o2;
        var i = n2.parent.autoPlayStart();
        e && e(null, n2.parent, i);
      }
    };
    t2 instanceof AudioBuffer ? o(null, t2) : this.parent.context.decode(t2, o);
  }, t;
}(), A = function() {
  function t(t2, e) {
    this.media = t2, this.options = e, this._instances = [], this._sprites = {}, this.media.init(this);
    var n2 = e.complete;
    this._autoPlayOptions = n2 ? { complete: n2 } : null, this.isLoaded = false, this.isPlaying = false, this.autoPlay = e.autoPlay, this.singleInstance = e.singleInstance, this.preload = e.preload || this.autoPlay, this.url = e.url, this.speed = e.speed, this.volume = e.volume, this.loop = e.loop, e.sprites && this.addSprites(e.sprites), this.preload && this._preload(e.loaded);
  }
  return t.from = function(e) {
    var n2 = {};
    return "string" == typeof e ? n2.url = e : e instanceof ArrayBuffer || e instanceof AudioBuffer || e instanceof HTMLAudioElement ? n2.source = e : n2 = e, (n2 = c({ autoPlay: false, singleInstance: false, url: null, source: null, preload: false, volume: 1, speed: 1, complete: null, loaded: null, loop: false }, n2)).url && (n2.url = d(n2.url)), Object.freeze(n2), new t(s().useLegacy ? new g() : new w(), n2);
  }, Object.defineProperty(t.prototype, "context", { get: function() {
    return s().context;
  }, enumerable: false, configurable: true }), t.prototype.pause = function() {
    return this.isPlaying = false, this.paused = true, this;
  }, t.prototype.resume = function() {
    return this.isPlaying = this._instances.length > 0, this.paused = false, this;
  }, Object.defineProperty(t.prototype, "paused", { get: function() {
    return this._paused;
  }, set: function(t2) {
    this._paused = t2, this.refreshPaused();
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "speed", { get: function() {
    return this._speed;
  }, set: function(t2) {
    this._speed = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "filters", { get: function() {
    return this.media.filters;
  }, set: function(t2) {
    this.media.filters = t2;
  }, enumerable: false, configurable: true }), t.prototype.addSprites = function(t2, e) {
    if ("object" == typeof t2) {
      var n2 = {};
      for (var o in t2)
        n2[o] = this.addSprites(o, t2[o]);
      return n2;
    }
    var i = new b(this, e);
    return this._sprites[t2] = i, i;
  }, t.prototype.destroy = function() {
    this._removeInstances(), this.removeSprites(), this.media.destroy(), this.media = null, this._sprites = null, this._instances = null;
  }, t.prototype.removeSprites = function(t2) {
    if (t2) {
      var e = this._sprites[t2];
      void 0 !== e && (e.destroy(), delete this._sprites[t2]);
    } else
      for (var n2 in this._sprites)
        this.removeSprites(n2);
    return this;
  }, Object.defineProperty(t.prototype, "isPlayable", { get: function() {
    return this.isLoaded && this.media && this.media.isPlayable;
  }, enumerable: false, configurable: true }), t.prototype.stop = function() {
    if (!this.isPlayable)
      return this.autoPlay = false, this._autoPlayOptions = null, this;
    this.isPlaying = false;
    for (var t2 = this._instances.length - 1; t2 >= 0; t2--)
      this._instances[t2].stop();
    return this;
  }, t.prototype.play = function(t2, e) {
    var n2, o = this;
    "string" == typeof t2 ? n2 = { sprite: r2 = t2, loop: this.loop, complete: e } : "function" == typeof t2 ? (n2 = {}).complete = t2 : n2 = t2;
    if ((n2 = c({ complete: null, loaded: null, sprite: null, end: null, start: 0, volume: 1, speed: 1, muted: false, loop: false }, n2 || {})).sprite) {
      var i = n2.sprite, r2 = this._sprites[i];
      n2.start = r2.start + (n2.start || 0), n2.end = r2.end, n2.speed = r2.speed || 1, n2.loop = r2.loop || n2.loop, delete n2.sprite;
    }
    if (n2.offset && (n2.start = n2.offset), !this.isLoaded)
      return new Promise(function(t3, e2) {
        o.autoPlay = true, o._autoPlayOptions = n2, o._preload(function(o2, i2, r3) {
          o2 ? e2(o2) : (n2.loaded && n2.loaded(o2, i2, r3), t3(r3));
        });
      });
    (this.singleInstance || n2.singleInstance) && this._removeInstances();
    var s2 = this._createInstance();
    return this._instances.push(s2), this.isPlaying = true, s2.once("end", function() {
      n2.complete && n2.complete(o), o._onComplete(s2);
    }), s2.once("stop", function() {
      o._onComplete(s2);
    }), s2.play(n2), s2;
  }, t.prototype.refresh = function() {
    for (var t2 = this._instances.length, e = 0; e < t2; e++)
      this._instances[e].refresh();
  }, t.prototype.refreshPaused = function() {
    for (var t2 = this._instances.length, e = 0; e < t2; e++)
      this._instances[e].refreshPaused();
  }, Object.defineProperty(t.prototype, "volume", { get: function() {
    return this._volume;
  }, set: function(t2) {
    this._volume = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "muted", { get: function() {
    return this._muted;
  }, set: function(t2) {
    this._muted = t2, this.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "loop", { get: function() {
    return this._loop;
  }, set: function(t2) {
    this._loop = t2, this.refresh();
  }, enumerable: false, configurable: true }), t.prototype._preload = function(t2) {
    this.media.load(t2);
  }, Object.defineProperty(t.prototype, "instances", { get: function() {
    return this._instances;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "sprites", { get: function() {
    return this._sprites;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "duration", { get: function() {
    return this.media.duration;
  }, enumerable: false, configurable: true }), t.prototype.autoPlayStart = function() {
    var t2;
    return this.autoPlay && (t2 = this.play(this._autoPlayOptions)), t2;
  }, t.prototype._removeInstances = function() {
    for (var t2 = this._instances.length - 1; t2 >= 0; t2--)
      this._poolInstance(this._instances[t2]);
    this._instances.length = 0;
  }, t.prototype._onComplete = function(t2) {
    if (this._instances) {
      var e = this._instances.indexOf(t2);
      e > -1 && this._instances.splice(e, 1), this.isPlaying = this._instances.length > 0;
    }
    this._poolInstance(t2);
  }, t.prototype._createInstance = function() {
    if (t._pool.length > 0) {
      var e = t._pool.pop();
      return e.init(this.media), e;
    }
    return this.media.create();
  }, t.prototype._poolInstance = function(e) {
    e.destroy(), t._pool.indexOf(e) < 0 && t._pool.push(e);
  }, t._pool = [], t;
}(), F = function(t) {
  function e() {
    var e2 = null !== t && t.apply(this, arguments) || this;
    return e2.speed = 1, e2.muted = false, e2.volume = 1, e2.paused = false, e2;
  }
  return a(e, t), e.prototype.refresh = function() {
    this.emit("refresh");
  }, e.prototype.refreshPaused = function() {
    this.emit("refreshPaused");
  }, Object.defineProperty(e.prototype, "filters", { get: function() {
    return null;
  }, set: function(t2) {
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "audioContext", { get: function() {
    return null;
  }, enumerable: false, configurable: true }), e.prototype.toggleMute = function() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }, e.prototype.togglePause = function() {
    return this.paused = !this.paused, this.refreshPaused(), this.paused;
  }, e.prototype.destroy = function() {
    this.removeAllListeners();
  }, e;
}(n), C = function(t) {
  function e() {
    var o = this, i = window, r2 = new e.AudioContext(), s2 = r2.createDynamicsCompressor(), u2 = r2.createAnalyser();
    return u2.connect(s2), s2.connect(r2.destination), (o = t.call(this, u2, s2) || this)._ctx = r2, o._offlineCtx = new e.OfflineAudioContext(1, 2, i.OfflineAudioContext ? Math.max(8e3, Math.min(96e3, r2.sampleRate)) : 44100), o._unlocked = false, o.compressor = s2, o.analyser = u2, o.events = new n(), o.volume = 1, o.speed = 1, o.muted = false, o.paused = false, "running" !== r2.state && (o._unlock(), o._unlock = o._unlock.bind(o), document.addEventListener("mousedown", o._unlock, true), document.addEventListener("touchstart", o._unlock, true), document.addEventListener("touchend", o._unlock, true)), o;
  }
  return a(e, t), e.prototype._unlock = function() {
    this._unlocked || (this.playEmptySound(), "running" === this._ctx.state && (document.removeEventListener("mousedown", this._unlock, true), document.removeEventListener("touchend", this._unlock, true), document.removeEventListener("touchstart", this._unlock, true), this._unlocked = true));
  }, e.prototype.playEmptySound = function() {
    var t2 = this._ctx.createBufferSource();
    t2.buffer = this._ctx.createBuffer(1, 1, 22050), t2.connect(this._ctx.destination), t2.start(0, 0, 0), "suspended" === t2.context.state && t2.context.resume();
  }, Object.defineProperty(e, "AudioContext", { get: function() {
    var t2 = window;
    return t2.AudioContext || t2.webkitAudioContext || null;
  }, enumerable: false, configurable: true }), Object.defineProperty(e, "OfflineAudioContext", { get: function() {
    var t2 = window;
    return t2.OfflineAudioContext || t2.webkitOfflineAudioContext || null;
  }, enumerable: false, configurable: true }), e.prototype.destroy = function() {
    t.prototype.destroy.call(this);
    var e2 = this._ctx;
    void 0 !== e2.close && e2.close(), this.events.removeAllListeners(), this.analyser.disconnect(), this.compressor.disconnect(), this.analyser = null, this.compressor = null, this.events = null, this._offlineCtx = null, this._ctx = null;
  }, Object.defineProperty(e.prototype, "audioContext", { get: function() {
    return this._ctx;
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "offlineContext", { get: function() {
    return this._offlineCtx;
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "paused", { get: function() {
    return this._paused;
  }, set: function(t2) {
    t2 && "running" === this._ctx.state ? this._ctx.suspend() : t2 || "suspended" !== this._ctx.state || this._ctx.resume(), this._paused = t2;
  }, enumerable: false, configurable: true }), e.prototype.refresh = function() {
    this.events.emit("refresh");
  }, e.prototype.refreshPaused = function() {
    this.events.emit("refreshPaused");
  }, e.prototype.toggleMute = function() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }, e.prototype.togglePause = function() {
    return this.paused = !this.paused, this.refreshPaused(), this._paused;
  }, e.prototype.decode = function(t2, e2) {
    var n2 = function(t3) {
      e2(new Error((null == t3 ? void 0 : t3.message) || "Unable to decode file"));
    }, o = this._offlineCtx.decodeAudioData(t2, function(t3) {
      e2(null, t3);
    }, n2);
    o && o.catch(n2);
  }, e;
}(O), E = function() {
  function t() {
    this.init();
  }
  return t.prototype.init = function() {
    return this.supported && (this._webAudioContext = new C()), this._htmlAudioContext = new F(), this._sounds = {}, this.useLegacy = !this.supported, this;
  }, Object.defineProperty(t.prototype, "context", { get: function() {
    return this._context;
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "filtersAll", { get: function() {
    return this.useLegacy ? [] : this._context.filters;
  }, set: function(t2) {
    this.useLegacy || (this._context.filters = t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "supported", { get: function() {
    return null !== C.AudioContext;
  }, enumerable: false, configurable: true }), t.prototype.add = function(t2, e) {
    if ("object" == typeof t2) {
      var n2 = {};
      for (var o in t2) {
        var i = this._getOptions(t2[o], e);
        n2[o] = this.add(o, i);
      }
      return n2;
    }
    if (e instanceof A)
      return this._sounds[t2] = e, e;
    var r2 = this._getOptions(e), s2 = A.from(r2);
    return this._sounds[t2] = s2, s2;
  }, t.prototype._getOptions = function(t2, e) {
    var n2;
    return n2 = "string" == typeof t2 ? { url: t2 } : t2 instanceof ArrayBuffer || t2 instanceof AudioBuffer || t2 instanceof HTMLAudioElement ? { source: t2 } : t2, n2 = c(c({}, n2), e || {});
  }, Object.defineProperty(t.prototype, "useLegacy", { get: function() {
    return this._useLegacy;
  }, set: function(t2) {
    _.setLegacy(t2), this._useLegacy = t2, this._context = !t2 && this.supported ? this._webAudioContext : this._htmlAudioContext;
  }, enumerable: false, configurable: true }), t.prototype.remove = function(t2) {
    return this.exists(t2, true), this._sounds[t2].destroy(), delete this._sounds[t2], this;
  }, Object.defineProperty(t.prototype, "volumeAll", { get: function() {
    return this._context.volume;
  }, set: function(t2) {
    this._context.volume = t2, this._context.refresh();
  }, enumerable: false, configurable: true }), Object.defineProperty(t.prototype, "speedAll", { get: function() {
    return this._context.speed;
  }, set: function(t2) {
    this._context.speed = t2, this._context.refresh();
  }, enumerable: false, configurable: true }), t.prototype.togglePauseAll = function() {
    return this._context.togglePause();
  }, t.prototype.pauseAll = function() {
    return this._context.paused = true, this._context.refreshPaused(), this;
  }, t.prototype.resumeAll = function() {
    return this._context.paused = false, this._context.refreshPaused(), this;
  }, t.prototype.toggleMuteAll = function() {
    return this._context.toggleMute();
  }, t.prototype.muteAll = function() {
    return this._context.muted = true, this._context.refresh(), this;
  }, t.prototype.unmuteAll = function() {
    return this._context.muted = false, this._context.refresh(), this;
  }, t.prototype.removeAll = function() {
    for (var t2 in this._sounds)
      this._sounds[t2].destroy(), delete this._sounds[t2];
    return this;
  }, t.prototype.stopAll = function() {
    for (var t2 in this._sounds)
      this._sounds[t2].stop();
    return this;
  }, t.prototype.exists = function(t2, e) {
    return !!this._sounds[t2];
  }, t.prototype.find = function(t2) {
    return this.exists(t2, true), this._sounds[t2];
  }, t.prototype.play = function(t2, e) {
    return this.find(t2).play(e);
  }, t.prototype.stop = function(t2) {
    return this.find(t2).stop();
  }, t.prototype.pause = function(t2) {
    return this.find(t2).pause();
  }, t.prototype.resume = function(t2) {
    return this.find(t2).resume();
  }, t.prototype.volume = function(t2, e) {
    var n2 = this.find(t2);
    return void 0 !== e && (n2.volume = e), n2.volume;
  }, t.prototype.speed = function(t2, e) {
    var n2 = this.find(t2);
    return void 0 !== e && (n2.speed = e), n2.speed;
  }, t.prototype.duration = function(t2) {
    return this.find(t2).duration;
  }, t.prototype.close = function() {
    return this.removeAll(), this._sounds = null, this._webAudioContext && (this._webAudioContext.destroy(), this._webAudioContext = null), this._htmlAudioContext && (this._htmlAudioContext.destroy(), this._htmlAudioContext = null), this._context = null, this;
  }, t;
}(), S = function() {
  function t(t2, e) {
    this.init(t2, e);
  }
  return t.prototype.init = function(t2, e) {
    this.destination = t2, this.source = e || t2;
  }, t.prototype.connect = function(t2) {
    this.source.connect(t2);
  }, t.prototype.disconnect = function() {
    this.source.disconnect();
  }, t.prototype.destroy = function() {
    this.disconnect(), this.destination = null, this.source = null;
  }, t;
}();
({ __proto__: null, Filter: S, EqualizerFilter: function(t) {
  function e(n2, o, i, r2, u2, a2, c2, l2, p2, h2) {
    void 0 === n2 && (n2 = 0), void 0 === o && (o = 0), void 0 === i && (i = 0), void 0 === r2 && (r2 = 0), void 0 === u2 && (u2 = 0), void 0 === a2 && (a2 = 0), void 0 === c2 && (c2 = 0), void 0 === l2 && (l2 = 0), void 0 === p2 && (p2 = 0), void 0 === h2 && (h2 = 0);
    var f2 = this;
    if (!s().useLegacy) {
      var d2 = [{ f: e.F32, type: "lowshelf", gain: n2 }, { f: e.F64, type: "peaking", gain: o }, { f: e.F125, type: "peaking", gain: i }, { f: e.F250, type: "peaking", gain: r2 }, { f: e.F500, type: "peaking", gain: u2 }, { f: e.F1K, type: "peaking", gain: a2 }, { f: e.F2K, type: "peaking", gain: c2 }, { f: e.F4K, type: "peaking", gain: l2 }, { f: e.F8K, type: "peaking", gain: p2 }, { f: e.F16K, type: "highshelf", gain: h2 }].map(function(t2) {
        var e2 = s().context.audioContext.createBiquadFilter();
        return e2.type = t2.type, v.setParamValue(e2.Q, 1), e2.frequency.value = t2.f, v.setParamValue(e2.gain, t2.gain), e2;
      });
      (f2 = t.call(this, d2[0], d2[d2.length - 1]) || this).bands = d2, f2.bandsMap = {};
      for (var _2 = 0; _2 < f2.bands.length; _2++) {
        var y2 = f2.bands[_2];
        _2 > 0 && f2.bands[_2 - 1].connect(y2), f2.bandsMap[y2.frequency.value] = y2;
      }
      return f2;
    }
    f2 = t.call(this, null) || this;
  }
  return a(e, t), e.prototype.setGain = function(t2, e2) {
    if (void 0 === e2 && (e2 = 0), !this.bandsMap[t2])
      throw new Error("No band found for frequency ".concat(t2));
    v.setParamValue(this.bandsMap[t2].gain, e2);
  }, e.prototype.getGain = function(t2) {
    if (!this.bandsMap[t2])
      throw new Error("No band found for frequency ".concat(t2));
    return this.bandsMap[t2].gain.value;
  }, Object.defineProperty(e.prototype, "f32", { get: function() {
    return this.getGain(e.F32);
  }, set: function(t2) {
    this.setGain(e.F32, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f64", { get: function() {
    return this.getGain(e.F64);
  }, set: function(t2) {
    this.setGain(e.F64, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f125", { get: function() {
    return this.getGain(e.F125);
  }, set: function(t2) {
    this.setGain(e.F125, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f250", { get: function() {
    return this.getGain(e.F250);
  }, set: function(t2) {
    this.setGain(e.F250, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f500", { get: function() {
    return this.getGain(e.F500);
  }, set: function(t2) {
    this.setGain(e.F500, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f1k", { get: function() {
    return this.getGain(e.F1K);
  }, set: function(t2) {
    this.setGain(e.F1K, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f2k", { get: function() {
    return this.getGain(e.F2K);
  }, set: function(t2) {
    this.setGain(e.F2K, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f4k", { get: function() {
    return this.getGain(e.F4K);
  }, set: function(t2) {
    this.setGain(e.F4K, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f8k", { get: function() {
    return this.getGain(e.F8K);
  }, set: function(t2) {
    this.setGain(e.F8K, t2);
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "f16k", { get: function() {
    return this.getGain(e.F16K);
  }, set: function(t2) {
    this.setGain(e.F16K, t2);
  }, enumerable: false, configurable: true }), e.prototype.reset = function() {
    this.bands.forEach(function(t2) {
      v.setParamValue(t2.gain, 0);
    });
  }, e.prototype.destroy = function() {
    this.bands.forEach(function(t2) {
      t2.disconnect();
    }), this.bands = null, this.bandsMap = null;
  }, e.F32 = 32, e.F64 = 64, e.F125 = 125, e.F250 = 250, e.F500 = 500, e.F1K = 1e3, e.F2K = 2e3, e.F4K = 4e3, e.F8K = 8e3, e.F16K = 16e3, e;
}(S), DistortionFilter: function(t) {
  function e(e2) {
    void 0 === e2 && (e2 = 0);
    var n2 = this;
    if (!s().useLegacy) {
      var o = s().context.audioContext.createWaveShaper();
      return (n2 = t.call(this, o) || this)._distortion = o, n2.amount = e2, n2;
    }
    n2 = t.call(this, null) || this;
  }
  return a(e, t), Object.defineProperty(e.prototype, "amount", { get: function() {
    return this._amount;
  }, set: function(t2) {
    this._amount = t2;
    for (var e2, n2 = 1e3 * t2, o = 44100, i = new Float32Array(o), r2 = Math.PI / 180, s2 = 0; s2 < o; ++s2)
      e2 = 2 * s2 / o - 1, i[s2] = (3 + n2) * e2 * 20 * r2 / (Math.PI + n2 * Math.abs(e2));
    this._distortion.curve = i, this._distortion.oversample = "4x";
  }, enumerable: false, configurable: true }), e.prototype.destroy = function() {
    this._distortion = null, t.prototype.destroy.call(this);
  }, e;
}(S), StereoFilter: function(t) {
  function e(e2) {
    void 0 === e2 && (e2 = 0);
    var n2 = this;
    if (!s().useLegacy) {
      var o, i, r2, u2 = s().context.audioContext;
      return u2.createStereoPanner ? r2 = o = u2.createStereoPanner() : ((i = u2.createPanner()).panningModel = "equalpower", r2 = i), (n2 = t.call(this, r2) || this)._stereo = o, n2._panner = i, n2.pan = e2, n2;
    }
    n2 = t.call(this, null) || this;
  }
  return a(e, t), Object.defineProperty(e.prototype, "pan", { get: function() {
    return this._pan;
  }, set: function(t2) {
    this._pan = t2, this._stereo ? v.setParamValue(this._stereo.pan, t2) : this._panner.setPosition(t2, 0, 1 - Math.abs(t2));
  }, enumerable: false, configurable: true }), e.prototype.destroy = function() {
    t.prototype.destroy.call(this), this._stereo = null, this._panner = null;
  }, e;
}(S), ReverbFilter: function(t) {
  function e(e2, n2, o) {
    void 0 === e2 && (e2 = 3), void 0 === n2 && (n2 = 2), void 0 === o && (o = false);
    var i = this;
    if (!s().useLegacy)
      return (i = t.call(this, null) || this)._seconds = i._clamp(e2, 1, 50), i._decay = i._clamp(n2, 0, 100), i._reverse = o, i._rebuild(), i;
    i = t.call(this, null) || this;
  }
  return a(e, t), e.prototype._clamp = function(t2, e2, n2) {
    return Math.min(n2, Math.max(e2, t2));
  }, Object.defineProperty(e.prototype, "seconds", { get: function() {
    return this._seconds;
  }, set: function(t2) {
    this._seconds = this._clamp(t2, 1, 50), this._rebuild();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "decay", { get: function() {
    return this._decay;
  }, set: function(t2) {
    this._decay = this._clamp(t2, 0, 100), this._rebuild();
  }, enumerable: false, configurable: true }), Object.defineProperty(e.prototype, "reverse", { get: function() {
    return this._reverse;
  }, set: function(t2) {
    this._reverse = t2, this._rebuild();
  }, enumerable: false, configurable: true }), e.prototype._rebuild = function() {
    for (var t2, e2 = s().context.audioContext, n2 = e2.sampleRate, o = n2 * this._seconds, i = e2.createBuffer(2, o, n2), r2 = i.getChannelData(0), u2 = i.getChannelData(1), a2 = 0; a2 < o; a2++)
      t2 = this._reverse ? o - a2 : a2, r2[a2] = (2 * Math.random() - 1) * Math.pow(1 - t2 / o, this._decay), u2[a2] = (2 * Math.random() - 1) * Math.pow(1 - t2 / o, this._decay);
    var c2 = s().context.audioContext.createConvolver();
    c2.buffer = i, this.init(c2);
  }, e;
}(S), MonoFilter: function(t) {
  function e() {
    var e2 = this;
    if (!s().useLegacy) {
      var n2 = s().context.audioContext, o = n2.createChannelSplitter(), i = n2.createChannelMerger();
      return i.connect(o), (e2 = t.call(this, i, o) || this)._merger = i, e2;
    }
    e2 = t.call(this, null) || this;
  }
  return a(e, t), e.prototype.destroy = function() {
    this._merger.disconnect(), this._merger = null, t.prototype.destroy.call(this);
  }, e;
}(S), StreamFilter: function(t) {
  function e() {
    var e2 = this;
    if (!s().useLegacy) {
      var n2 = s().context.audioContext, o = n2.createMediaStreamDestination(), i = n2.createMediaStreamSource(o.stream);
      return (e2 = t.call(this, o, i) || this)._stream = o.stream, e2;
    }
    e2 = t.call(this, null) || this;
  }
  return a(e, t), Object.defineProperty(e.prototype, "stream", { get: function() {
    return this._stream;
  }, enumerable: false, configurable: true }), e.prototype.destroy = function() {
    this._stream = null, t.prototype.destroy.call(this);
  }, e;
}(S), TelephoneFilter: function(t) {
  function e() {
    if (!s().useLegacy) {
      var e2 = s().context.audioContext, n2 = e2.createBiquadFilter(), o = e2.createBiquadFilter(), i = e2.createBiquadFilter(), r2 = e2.createBiquadFilter();
      return n2.type = "lowpass", v.setParamValue(n2.frequency, 2e3), o.type = "lowpass", v.setParamValue(o.frequency, 2e3), i.type = "highpass", v.setParamValue(i.frequency, 500), r2.type = "highpass", v.setParamValue(r2.frequency, 500), n2.connect(o), o.connect(i), i.connect(r2), t.call(this, n2, r2) || this;
    }
    t.call(this, null);
  }
  return a(e, t), e;
}(S) });
(function(t) {
  return r = t, t;
})(new E());
Loader.registerPlugin(_);
class FBaseSoundPlayer {
  constructor(world) {
    __publicField(this, "world");
    __publicField(this, "overlayToggleSoundImg");
    __publicField(this, "sounds", {});
    __publicField(this, "backgroundMusic", null);
    __publicField(this, "menuMusic", null);
    __publicField(this, "isSoundOn", false);
    this.world = world;
    this.overlayToggleSoundImg = document.getElementById("overlayToggleSound");
    for (const soundFilePath of ALL_SOUND_FILE_PATHS) {
      this.sounds[soundFilePath] = this.loadSound(soundFilePath);
    }
    this.menuMusic = this.createMenuMusic();
    void this.updateIsSoundOn();
    this.overlayToggleSoundImg.onclick = () => this.onToggleSoundClicked();
  }
  async onToggleSoundClicked() {
    const nextStorageValue = this.isSoundOn ? StorageValueEnum.Off : StorageValueEnum.On;
    await FStorage.set(StorageKeyEnum.IsSoundOn, nextStorageValue);
    await this.updateIsSoundOn();
    const soundSettingsItem = SettingsUtils.getAllSettingsItems().find((item) => item.storageKey === StorageKeyEnum.IsSoundOn);
    if (soundSettingsItem == null)
      throw new Error("Sound settings item not found");
    this.world.onSettingsItemChanged(soundSettingsItem, nextStorageValue);
  }
  async onMapLoaded() {
    this.stopMenuMusic();
    this.stopBackgroundMusic();
    await this.updateIsSoundOn();
    this.backgroundMusic = await this.createBackgroundMusic();
    this.playBackgroundMusic();
  }
  async updateIsSoundOn() {
    const isSoundOn = await FStorage.getString(StorageKeyEnum.IsSoundOn);
    this.isSoundOn = isSoundOn === StorageValueEnum.On;
    const svgName = this.isSoundOn ? "sound-on.svg" : "sound-off.svg";
    this.overlayToggleSoundImg.src = "/assets/svgs/" + svgName;
  }
  async createBackgroundMusic() {
    const musicType = await FStorage.getString(StorageKeyEnum.SelectedSoundtrack);
    return A.from({
      url: "/assets/" + this.getSoundTrackSelected(musicType ?? StorageValueEnum.MusicDefault),
      autoPlay: false,
      loop: true,
      volume: 0.35,
      complete: function() {
      }
    });
  }
  createMenuMusic() {
    return A.from({
      url: "/assets/" + SoundFileEnum.Brink,
      autoPlay: false,
      loop: true,
      volume: 0.2,
      complete: function() {
      }
    });
  }
  loadSound(audioUrl) {
    const link = "/assets/" + audioUrl;
    return A.from(link);
  }
  getSoundTrackSelected(Music) {
    switch (Music) {
      case StorageValueEnum.Music1:
        return SoundFileEnum.Uprise;
      case StorageValueEnum.Music2:
        return SoundFileEnum.Bloom;
      case StorageValueEnum.Music3:
        return SoundFileEnum.Dodosynthesis;
      case StorageValueEnum.Music4:
        return SoundFileEnum.Brink;
      case StorageValueEnum.MusicDefault:
      default:
        return CupUtils.getBackgroundMusicForCup(this.getCupIdForBackgroundMusic());
    }
  }
  playSound(soundFile) {
    if (!this.isSoundOn)
      return;
    const sound = this.sounds[soundFile];
    if (sound == null)
      throw new Error("Sound not found: " + soundFile);
    sound.volume = FBaseSoundPlayer.getVolume(soundFile);
    sound.play();
  }
  playBackgroundMusic() {
    if (!this.isSoundOn)
      return;
    if (this.backgroundMusic == null)
      return;
    if (this.backgroundMusic.isPlaying)
      return;
    this.backgroundMusic.play();
  }
  stopBackgroundMusic() {
    if (this.backgroundMusic == null)
      return;
    this.backgroundMusic.stop();
  }
  playMenuMusic() {
    if (!this.isSoundOn)
      return;
    if (this.menuMusic == null)
      return;
    if (this.menuMusic.isPlaying)
      return;
    this.menuMusic.play();
  }
  stopMenuMusic() {
    if (this.menuMusic == null)
      return;
    this.menuMusic.stop();
  }
  static getVolume(soundFile) {
    switch (soundFile) {
      case SoundFileEnum.Click:
        return 0.7;
      default:
        return 1;
    }
  }
}
class FSingleSoundPlayer extends FBaseSoundPlayer {
  constructor(world) {
    super(world);
    __publicField(this, "singleWorld");
    this.singleWorld = world;
  }
  onSettingsItemChanged(newStorageValue) {
    this.isSoundOn = newStorageValue === StorageValueEnum.On;
    if (this.singleWorld.mainState.pageId === PageIdEnum.Game) {
      if (this.isSoundOn) {
        this.playBackgroundMusic();
      } else {
        this.stopBackgroundMusic();
      }
    } else {
      if (this.isSoundOn) {
        this.playMenuMusic();
      } else {
        this.stopMenuMusic();
      }
    }
  }
  getCupIdForBackgroundMusic() {
    if (this.singleWorld.mainState.mapListing == null)
      return this.singleWorld.mainState.browsingCupId;
    return this.singleWorld.mainState.mapListing.cupId;
  }
}
const WIDTH_TO_HEIGHT_RATIO = 4 / 3;
const EXTENSION_MENU_WIDTH = 340;
const EXTENSION_MENU_HEIGHT = 600;
const EXTENSION_GAME_WIDTH = 800;
const EXTENSION_GAME_HEIGHT = 600;
class FResolutionManager {
  constructor(world) {
    __publicField(this, "appDiv", document.getElementById("app"));
    __publicField(this, "renderCanvas", document.getElementById("renderCanvas"));
    __publicField(this, "world");
    __publicField(this, "targetWidth", 1);
    __publicField(this, "targetHeight", 1);
    this.world = world;
  }
  resizeScreenForMenu() {
    document.body.style.overflow = "auto";
    this.appDiv.style.overflow = "auto";
    if (DeploymentUtils.isExtension()) {
      document.body.style.width = EXTENSION_MENU_WIDTH + "px";
      document.body.style.height = EXTENSION_MENU_HEIGHT + "px";
    }
  }
  resizeScreenForGame() {
    document.body.style.overflow = "hidden";
    this.appDiv.style.overflow = "hidden";
    if (DeploymentUtils.isExtension()) {
      document.body.style.width = EXTENSION_GAME_WIDTH + "px";
      document.body.style.height = EXTENSION_GAME_HEIGHT + "px";
      engine.resize();
      return;
    }
    const screenHeight = this.renderCanvas.clientHeight;
    const screenWidth = this.renderCanvas.clientWidth;
    const scaleFactor = screenHeight / screenWidth > this.targetHeight / this.targetWidth ? Math.min(screenHeight, this.targetHeight) / screenHeight : Math.min(screenWidth, this.targetWidth) / screenWidth;
    const finalHeight = screenHeight * scaleFactor;
    const finalWidth = screenWidth * scaleFactor;
    engine.setSize(finalWidth, finalHeight);
  }
  setResolution(storageValue) {
    this.targetHeight = FResolutionManager.getHeightFromResolution(storageValue);
    this.targetWidth = this.targetHeight * WIDTH_TO_HEIGHT_RATIO;
  }
  static getHeightFromResolution(storageValue) {
    switch (storageValue) {
      case StorageValueEnum.Resolution400:
        return 400;
      case StorageValueEnum.Resolution600:
        return 600;
      case StorageValueEnum.Resolution900:
        return 900;
      default:
        throw new Error(`Invalid storage value: ${storageValue}`);
    }
  }
}
class PrintUtils {
  static green(text) {
    console.log("%c " + text, "background: #222; color: #bada55");
  }
  static pink(text) {
    console.log("%c " + text, "background: #222; color: pink");
  }
}
// set fps
const TARGET_FPS = 60;
const FPS_DETECT_SAMPLE_SIZE = 100;
const MAX_FPS = 72;
const MIN_FPS = 35;
class FBaseIntervalManager {
  constructor(world) {
    __publicField(this, "world");
    __publicField(this, "currentStorageValue", null);
    __publicField(this, "interval", null);
    __publicField(this, "didStartAnyInterval", false);
    __publicField(this, "detectedFpsList", []);
    __publicField(this, "didFpsDetectFinish", false);
    this.world = world;
  }
  startInterval() {
    if (this.didStartAnyInterval)
      return;
    this.didStartAnyInterval = true;
    switch (window.settings.renderLoop) {
      case StorageValueEnum.Fixed:
        PrintUtils.pink("Starting fixed interval");
        this.interval = setInterval(() => this.onRenderLoop(), 1e3 / TARGET_FPS);
        this.currentStorageValue = StorageValueEnum.Fixed;
        break;
      case StorageValueEnum.Vsync:
        PrintUtils.pink("Starting vsync interval");
        engine.runRenderLoop(() => this.onRenderLoop());
        this.currentStorageValue = StorageValueEnum.Vsync;
        break;
      default:
        throw new Error(`Unknown renderLoop value: ${window.settings.renderLoop}`);
    }
  }
  onSettingsItemChanged(newStorageValue) {
    if (this.currentStorageValue === newStorageValue)
      return;
    this.currentStorageValue = newStorageValue;
    if (this.currentStorageValue === StorageValueEnum.Fixed) {
      this.switchToFixedInterval();
    } else if (this.currentStorageValue === StorageValueEnum.Vsync) {
      this.switchToVsyncInterval();
    }
  }
  onRenderLoop() {
    update.loop();
    const fps = engine.getFps();
    this.detectFpsAndSwitchToFixedIntervalIfNeeded(fps);
    this.world.overlayManager.updateFpsText(fps);
  }
  detectFpsAndSwitchToFixedIntervalIfNeeded(fps) {
    if (this.didFpsDetectFinish)
      return;
    if (this.detectedFpsList.length < FPS_DETECT_SAMPLE_SIZE) {
      this.detectedFpsList.push(fps);
      return;
    }
    this.didFpsDetectFinish = true;
    const averageFps = ArrayUtils.getAverage(this.detectedFpsList);
    if (averageFps > MAX_FPS && this.currentStorageValue === StorageValueEnum.Vsync) {
      this.switchToFixedInterval();
      PrintUtils.pink("Switched to fixed interval due ot high FPS");
      return;
    }
    if (averageFps < MIN_FPS) {
      this.onLowFpsDetected();
    }
  }
  switchToFixedInterval() {
    PrintUtils.pink("switchToFixedInterval");
    if (!this.didStartAnyInterval)
      return;
    if (this.currentStorageValue === StorageValueEnum.Fixed)
      return;
    engine.stopRenderLoop();
    this.interval = setInterval(() => this.onRenderLoop(), 1e3 / TARGET_FPS);
  }
  switchToVsyncInterval() {
    PrintUtils.pink("switchToVsyncInterval");
    if (!this.didStartAnyInterval)
      return;
    if (this.currentStorageValue === StorageValueEnum.Vsync)
      return;
    if (this.interval != null)
      clearInterval(this.interval);
    engine.runRenderLoop(() => this.onRenderLoop());
  }
}
class FSingleIntervalManager extends FBaseIntervalManager {
  constructor(world) {
    super(world);
    __publicField(this, "singleWorld");
    this.singleWorld = world;
  }
  onLowFpsDetected() {
    this.singleWorld.createPopupItem(PopupItemCreator.lowFpsDetected());
  }
}
class FSingleWorld extends FBaseWorld {
  constructor(mainState, createPopupItem, returnToMenuFromGame, changeCupByDeltaIndex, onClickMap, reloadMainState, isPopupShowing, closeCurrentPopup) {
    super();
    __publicField(this, "createPopupItem");
    __publicField(this, "returnToMenuFromGame");
    __publicField(this, "changeCupByDeltaIndex");
    __publicField(this, "onClickMap");
    __publicField(this, "reloadMainState");
    __publicField(this, "isPopupShowing");
    __publicField(this, "closeCurrentPopup");
    __publicField(this, "inputManager");
    __publicField(this, "endingManager");
    __publicField(this, "soundPlayer");
    __publicField(this, "overlayManager");
    __publicField(this, "globalManager");
    __publicField(this, "intervalManager");
    __publicField(this, "popupManager");
    __publicField(this, "playerManager");
    __publicField(this, "objectManager");
    __publicField(this, "resolutionManager");
    __publicField(this, "isShowingPopup", false);
    __publicField(this, "mainState");
    this.mainState = mainState;
    this.createPopupItem = createPopupItem;
    this.changeCupByDeltaIndex = changeCupByDeltaIndex;
    this.returnToMenuFromGame = returnToMenuFromGame;
    this.onClickMap = onClickMap;
    this.reloadMainState = reloadMainState;
    this.isPopupShowing = isPopupShowing;
    this.closeCurrentPopup = closeCurrentPopup;
    this.inputManager = new FSingleInputManager(this);
    this.endingManager = new FSingleEndingManager(this);
    this.soundPlayer = new FSingleSoundPlayer(this);
    this.overlayManager = new FSingleOverlayManager(this);
    this.globalManager = new FGlobalManager(this);
    this.popupManager = new FSinglePopupManager(this);
    this.playerManager = new FSinglePlayerManager(this);
    this.objectManager = new FObjectManager(this);
    this.intervalManager = new FSingleIntervalManager(this);
    this.resolutionManager = new FResolutionManager(this);
    this.asyncInit();
  }
  async playMap(newMainState) {
    var _a;
    this.mainState = newMainState;
    // await FMapLoader.loadMap(this.mainState.mapListing.mapId, this.mainState.mapUrl);
    // console.log(this.mainState.mapListing.mapId);
    // console.log(this.mainState.mapListing.cupId);
    // console.log(this.mainState.mapListing.num);
    // console.log(this.mainState.mapListing);
    await FMapLoader.loadMap(this.mainState.mapListing.mapId, this.mainState.mapUrl, this.mainState.mapListing.cupId, this.mainState.mapListing.num);
    await this.onMapLoaded();
  }
  setMainState(newMainState) {
    this.mainState = newMainState;
  }
  setIsShowingPopup(isShowingPopup) {
    this.isShowingPopup = isShowingPopup;
  }
  displayEngineFailedPopup() {
    this.popupManager.displayEngineFailedPopup();
  }
  isBrewCupMap() {
    if (this.mainState == null)
      return false;
    return this.mainState.mapUrl != null;
  }
  isTestingMap() {
    if (this.mainState == null)
      return false;
    if (this.mainState.mapUrl == null)
      return false;
    return !this.mainState.mapUrl.includes("cdn.discordapp.com/attachments");
  }
  onLoaded() {
  }
}
const _sfc_main$e = defineComponent({
  props: {
    mainState: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      isExtension: DeploymentUtils.isExtension()
    };
    return data;
  },
  methods: {
    onClickFullScreen() {
      CompletedMapUtils.openMapListingInWebsite(this.mainState.mapListing);
    }
  }
});
const _imports_0$4 = "/assets/svgs/fullscreen.svg";
const _imports_0$3 = "/assets/svgs/sound-on.svg";
const _imports_2$2 = "/assets/svgs/arrow-left.svg";
const _imports_1$2 = "/assets/svgs/jump_enabled.svg";
const _imports_1$3 = "/assets/svgs/arrow-left.svg";
const _imports_2$1 = "/assets/svgs/controls_reversed.svg";
const _imports_3$1 = "/assets/svgs/drift_enabled.svg";
const _imports_7$1 = "/assets/svgs/help.svg";
const _imports_7 = "/assets/svgs/info.svg";
const VGame_vue_vue_type_style_index_0_scoped_31fa11aa_lang = "";
const _withScopeId$9 = (n2) => (pushScopeId("data-v-31fa11aa"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$e = { id: "gameMain" };
const _hoisted_2$e = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ createBaseVNode("canvas", { id: "renderCanvas" }, null, -1));
const _hoisted_3$d = { id: "overlay" };
const _hoisted_4$9 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ createBaseVNode("div", { id: "overlayLoadingScreen" }, [
  /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge" }, "Loading map ...")
], -1));
const _hoisted_5$8 = /* @__PURE__ */ createStaticVNode('<img id="overlayToggleSound" class="hoverGrow noDrag" style="display:none;" src="' + _imports_0$3 + '" data-v-31fa11aa><img id="overlayMenuButton" class="hoverGrow noDrag" src="' + _imports_2$2 + '" data-v-31fa11aa><div id="overlayCurrentTime" class="textLarge overlayTime" data-v-31fa11aa>TIME: ??</div><div id="overlayBestTime" class="textLarge overlayTime" data-v-31fa11aa>BEST: ??</div><div id="overlayMapName" class="textLarge" data-v-31fa11aa>??</div><div id="overlayFps" class="textLarge" data-v-31fa11aa>?? FPS</div><div id="overlayInGameMessage" data-v-31fa11aa>??</div><div id="overlayControlChangeContainer" data-v-31fa11aa><div class="overlayControlChangeItem" id="overlayJumpEnabled" data-v-31fa11aa><h1 class="textLarge" data-v-31fa11aa>JUMP ENABLED</h1><img src="' + _imports_1$2 + '" data-v-31fa11aa></div><div class="overlayControlChangeItem" id="overlayPlatformerEnabled" data-v-31fa11aa><h1 class="textLarge" data-v-31fa11aa>PLATFORMER</h1><img src="' + _imports_1$3 + '" data-v-31fa11aa></div><div class="overlayControlChangeItem" id="overlayControlsReversed" data-v-31fa11aa><h1 class="textLarge" data-v-31fa11aa>CONTROLS REVERSED</h1><img src="' + _imports_2$1 + '" data-v-31fa11aa></div><div class="overlayControlChangeItem" id="overlayDriftEnabled" data-v-31fa11aa><h1 class="textLarge" data-v-31fa11aa>DRIFT ENABLED</h1><img src="' + _imports_3$1 + '" data-v-31fa11aa></div></div>', 8);
const _hoisted_13$2 = { id: "ending" };
const _hoisted_14$2 = /* @__PURE__ */ createStaticVNode('<div class="endingSpacer" data-v-31fa11aa></div><h1 id="endingMakerName" class="textLarge" data-v-31fa11aa>??</h1><div id="endingGradientStripe" data-v-31fa11aa><h1 id="endingMapName" class="textLarge" data-v-31fa11aa>??</h1><h1 id="endingMainText" class="textLarge" data-v-31fa11aa>You won!</h1></div><div id="endingTime" class="textArial" data-v-31fa11aa>TIME: ??</div><div id="endingDeathActions" data-v-31fa11aa><img id="endingHelp" class="endingIcon hoverGrow" src="' + _imports_7$1 + '" data-v-31fa11aa><div class="endingMenuButton buttonLarge noHighlight" data-v-31fa11aa>Menu [X]</div><div id="endingDeathRestartButton" class="buttonLarge noHighlight" data-v-31fa11aa>Restart [_]</div><img id="endingDeathInfo" class="endingIcon hoverGrow" src="' + _imports_7 + '" data-v-31fa11aa></div><div id="endingWinActions" data-v-31fa11aa><div class="endingMenuButton buttonLarge noHighlight" data-v-31fa11aa>Menu [X]</div><div id="endingWinRestartButton" class="buttonLarge noHighlight" data-v-31fa11aa>Play Again</div><div id="endingNextMapButton" class="buttonLarge noHighlight" data-v-31fa11aa>Next [_]</div><img id="endingWinInfo" class="endingIcon hoverGrow" src="' + _imports_7 + '" data-v-31fa11aa></div>', 6);
const _hoisted_20$2 = {
  key: 0,
  class: "textArial"
};
const _hoisted_21$2 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ createBaseVNode("span", { id: "sponsorName" }, null, -1));
const _hoisted_22$2 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ createBaseVNode("a", {
  id: "sponsorInquiryLink",
  class: "clickableText",
  href: "https://docs.google.com/document/d/e/2PACX-1vQzn2YZMyUGC8-kHo7hpcfT_haHklJEuIO4FVR7wrcXvvcOyRPVkv7DAYkHt-8nIyh5IdwTt0r2RgF3/pub",
  target: "_blank"
}, "Interested in sponsoring?", -1));
const _hoisted_23$2 = [
  _hoisted_21$2,
  _hoisted_22$2
];
const _hoisted_24$2 = /* @__PURE__ */ _withScopeId$9(() => /* @__PURE__ */ createBaseVNode("div", {
  id: "endingHorizontalBag",
  class: "bagSpace bagSpaceHorizontal"
}, null, -1));
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", _hoisted_1$e, [
    _hoisted_2$e,
    createBaseVNode("div", _hoisted_3$d, [
      _hoisted_4$9,
      _ctx.isExtension ? (openBlock(), createElementBlock("img", {
        key: 0,
        id: "overlayFullScreen",
        class: "hoverGrow noDrag",
        src: _imports_0$4,
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickFullScreen && _ctx.onClickFullScreen(...args))
      })) : createCommentVNode("", true),
      _hoisted_5$8
    ]),
    createBaseVNode("div", _hoisted_13$2, [
      _hoisted_14$2,
      _ctx.isExtension ? (openBlock(), createElementBlock("h1", _hoisted_20$2, _hoisted_23$2)) : createCommentVNode("", true),
      _hoisted_24$2
    ])
  ]);
}
const VGame = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__scopeId", "data-v-31fa11aa"]]);
const _sfc_main$d = defineComponent({
  props: {
    mapListing: {
      type: Object,
      required: true
    },
    mainState: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      colorClass: this.getColorClass()
    };
    return data;
  },
  watch: {
    mainState: {
      handler() {
        this.colorClass = this.getColorClass();
      },
      deep: true
    }
  },
  methods: {
    async onClickMap(mapListing) {
      if (CupUtils.isOnlyOnWebsite(mapListing.cupId, DeploymentUtils.isExtension())) {
        this.$emit("createPopupItem", FSinglePopupManager.createWebsiteOnlyPopupItem(mapListing, "map"));
        return;
      }
      if (ProgressUtils.isUltraHardAndLocked(mapListing.cupId, this.mainState.mainProgressState)) {
        this.$emit("createPopupItem", FSinglePopupManager.createUltraHardLockedPopupItem(this.mainState.mainProgressState, "map"));
        return;
      }
      if (await MapPropertyUtils.shouldDisplayEpilepsyWarning(mapListing.mapId)) {
        this.$emit("createPopupItem", FSinglePopupManager.createEpilepsyWarningPopup(() => this.openMap(mapListing)));
        return;
      }
      this.openMap(mapListing);
    },
    openMap(mapListing) {
      this.$emit("onClickMap", mapListing);
    },
    getColorClass() {
      const isUltrahardAndLocked = !this.mainState.isUltrahardUnlocked && this.mapListing.cupId === CupIdEnum.Ultrahard;
      if (isUltrahardAndLocked)
        return "colorRed";
      if (this.isBetweenIncluding(this.mainState.mapCompletionDictionary[this.mapListing.mapId].count, 0, 0))
        return "done_z";
      if (this.isBetweenIncluding(this.mainState.mapCompletionDictionary[this.mapListing.mapId].count, 1, 1))
        return "done_a";
      if (this.isBetweenIncluding(this.mainState.mapCompletionDictionary[this.mapListing.mapId].count, 2, 2))
        return "done_b";
      if (this.isBetweenIncluding(this.mainState.mapCompletionDictionary[this.mapListing.mapId].count, 3, 9))
        return "done_c";
      if (this.isBetweenIncluding(this.mainState.mapCompletionDictionary[this.mapListing.mapId].count, 10, 99))
        return "done_d";
      if (this.isBetweenIncluding(this.mainState.mapCompletionDictionary[this.mapListing.mapId].count, 100, 999))
        return "done_e";
      if (this.isBetweenIncluding(this.mainState.mapCompletionDictionary[this.mapListing.mapId].count, 1e3, Infinity))
        return "done_f";
      throw new Error("Invalid map completion count");
    },
    isBetweenIncluding(value, min, max) {
      return value >= min && value <= max;
    }
  },
  async mounted() {
  }
});
const VMapListing_vue_vue_type_style_index_0_scoped_2dc2a0c5_lang = "";
const _withScopeId$8 = (n2) => (pushScopeId("data-v-2dc2a0c5"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$d = { class: "mapListingName" };
const _hoisted_2$d = { class: "mapListingDescription" };
const _hoisted_3$c = /* @__PURE__ */ _withScopeId$8(() => /* @__PURE__ */ createBaseVNode("span", null, " - ", -1));
const _hoisted_4$8 = { key: 0 };
const _hoisted_5$7 = { key: 1 };
const _hoisted_6$6 = { key: 2 };
const _hoisted_7$6 = { key: 3 };
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", null, [
    createBaseVNode("div", {
      class: normalizeClass(_ctx.colorClass + " mapListing noHighlight"),
      onClick: _cache[0] || (_cache[0] = () => _ctx.onClickMap(_ctx.mapListing))
    }, [
      createBaseVNode("h2", _hoisted_1$d, toDisplayString(_ctx.mapListing.name), 1),
      createBaseVNode("p", _hoisted_2$d, [
        createBaseVNode("span", null, "Difficulty: " + toDisplayString(_ctx.mapListing.diff), 1),
        _hoisted_3$c,
        _ctx.mainState.mapCompletionDictionary[_ctx.mapListing.mapId].count === 0 ? (openBlock(), createElementBlock("span", _hoisted_4$8, "Click to play")) : _ctx.mainState.mapCompletionDictionary[_ctx.mapListing.mapId].count === 1 ? (openBlock(), createElementBlock("span", _hoisted_5$7, "Completed")) : _ctx.mainState.mapCompletionDictionary[_ctx.mapListing.mapId].count === 2 ? (openBlock(), createElementBlock("span", _hoisted_6$6, "Completed Twice")) : _ctx.mainState.mapCompletionDictionary[_ctx.mapListing.mapId].count >= 3 ? (openBlock(), createElementBlock("span", _hoisted_7$6, "Completed " + toDisplayString(_ctx.mainState.mapCompletionDictionary[_ctx.mapListing.mapId].count) + " times", 1)) : createCommentVNode("", true)
      ])
    ], 2)
  ]);
}
const VMapListing = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__scopeId", "data-v-2dc2a0c5"]]);
const _sfc_main$c = defineComponent({
  data() {
    const data = {
      isStickyVisible: false,
      stickyHtml: ""
    };
    return data;
  },
  methods: {
    onClickHideButton() {
      this.isStickyVisible = false;
    }
  },
  async mounted() {
    const fetchResult = await FetchUtils.fetch(ApiEndpoints.GetSticky.Path, {}, true);
    if (fetchResult == null)
      return;
    if (fetchResult.html == "none")
      return;
    this.stickyHtml = fetchResult.html;
    this.isStickyVisible = true;
  }
});
const _imports_0$2 = "/assets/svgs/cross.svg";
const VSticky_vue_vue_type_style_index_0_scoped_92828c32_lang = "";
const _hoisted_1$c = {
  key: 0,
  class: "stickyMain"
};
const _hoisted_2$c = ["innerHTML"];
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.isStickyVisible ? (openBlock(), createElementBlock("main", _hoisted_1$c, [
    createBaseVNode("div", {
      class: "stickyContents htmlContents",
      innerHTML: _ctx.stickyHtml
    }, null, 8, _hoisted_2$c),
    createBaseVNode("img", {
      class: "hideButton hoverGrow noDrag",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickHideButton && _ctx.onClickHideButton(...args)),
      src: _imports_0$2
    })
  ])) : createCommentVNode("", true);
}
const VSticky = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__scopeId", "data-v-92828c32"]]);
const _sfc_main$b = defineComponent({
  props: {
    brewListing: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {};
    return data;
  },
  methods: {
    async onClickMap(brewListing) {
      if (DeploymentUtils.isExtension()) {
        this.$emit("createPopupItem", FSinglePopupManager.createBrewOpenOnWebsitePopupItem(brewListing));
        return;
      }
      this.openMap(brewListing);
    },
    openMap(brewListing) {
      const mapUrl = this.brewListing.jsUrl;
      this.$emit("onClickMap", null, mapUrl);
    }
  },
  async mounted() {
  }
});
const VBrewListing_vue_vue_type_style_index_0_scoped_2e7fa0b3_lang = "";
const _withScopeId$7 = (n2) => (pushScopeId("data-v-2e7fa0b3"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$b = { class: "mapListingName" };
const _hoisted_2$b = { class: "mapListingDescription" };
const _hoisted_3$b = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ createBaseVNode("span", null, " - ", -1));
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", null, [
    createBaseVNode("div", {
      class: "mapListing noHighlight done_z",
      onClick: _cache[0] || (_cache[0] = () => _ctx.onClickMap(_ctx.brewListing))
    }, [
      createBaseVNode("h2", _hoisted_1$b, toDisplayString(_ctx.brewListing.name), 1),
      createBaseVNode("p", _hoisted_2$b, [
        createBaseVNode("span", null, "Difficulty: " + toDisplayString(_ctx.brewListing.diff), 1),
        _hoisted_3$b,
        createBaseVNode("span", null, "Cup: " + toDisplayString(_ctx.brewListing.expectedCup), 1)
      ])
    ])
  ]);
}
const VBrewListing = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-2e7fa0b3"]]);
const _sfc_main$a = defineComponent({
  props: {
    mainState: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      cupName: "",
      cupImageUrl: "",
      brewLoadText: "Loading brew maps ...",
      mapListings: [],
      brewListings: [],
      isWebsiteOnlyCup: false,
      PageIdEnum,
      ProgressUtils,
      LinkEnum,
      CupIdEnum
    };
    return data;
  },
  methods: {
    onClickChangeCup(deltaIndex) {
      this.$emit("changeCupByDeltaIndex", deltaIndex);
    },
    onClickMap(mapListing, mapUrl) {
      this.$emit("onClickMap", mapListing, mapUrl);
    },
    changePageId(pageId) {
      this.$emit("changePageId", pageId);
    },
    createPopupItem(popupItem) {
      this.$emit("createPopupItem", popupItem);
    },
    isBetweenIncluding(value, min, max) {
      return value >= min && value <= max;
    },
    async onClickPlayButton() {
      if (this.mainState.browsingCupId === CupIdEnum.Brew) {
        this.createPopupItem(FSinglePopupManager.createBrewPopupItem());
        return;
      }
      const mapListing = MapUtils.getNextMapListingToPlayInCup(this.mainState.browsingCupId, this.mainState.mapCompletionDictionary, DeploymentUtils.isExtension());
      if (CupUtils.isOnlyOnWebsite(this.mainState.browsingCupId, DeploymentUtils.isExtension())) {
        this.createPopupItem(FSinglePopupManager.createWebsiteOnlyPopupItem(mapListing, "cup"));
        return;
      }
      if (ProgressUtils.isUltraHardAndLocked(this.mainState.browsingCupId, this.mainState.mainProgressState)) {
        this.createPopupItem(FSinglePopupManager.createUltraHardLockedPopupItem(this.mainState.mainProgressState, "cup"));
        return;
      }
      if (await MapPropertyUtils.shouldDisplayEpilepsyWarning(mapListing.mapId)) {
        this.$emit("createPopupItem", FSinglePopupManager.createEpilepsyWarningPopup(() => this.onClickMap(mapListing)));
        return;
      }
      this.onClickMap(mapListing);
    },
    onClickMultiplayer() {
      if (DeploymentUtils.isExtension()) {
        this.createPopupItem(FSinglePopupManager.createMultiplayerPopupItem());
      } else {
        window.location.href = "/multiplayer";
      }
    },
    onClickSync() {
      if (DeploymentUtils.isExtension()) {
        this.createPopupItem(FSinglePopupManager.createSyncPopupItem());
      } else {
        window.location.href = "/sync";
      }
    },
    onClickNewcomerHelpButton() {
      this.createPopupItem(NewcomerUtils.createNewcomerHelpPopupItem(this.mainState.mainProgressState));
    },
    async getBrewListings() {
      const payload = {};
      const result = await FetchUtils.fetch(ApiEndpoints.GetBrewListings.Path, payload, true);
      if (result == null) {
        this.brewLoadText = "Failed to load brew maps";
        return;
      }
      this.brewListings = result.brewListings;
      this.brewLoadText = "";
    }
  },
  watch: {
    mainState: {
      handler: function(newMainState, oldMainState) {
        this.cupName = CupUtils.getCupName(newMainState.browsingCupId);
        this.cupImageUrl = CupUtils.getCupSkinUrl(newMainState.browsingCupId);
        this.mapListings = MapUtils.getMapListings(newMainState.browsingCupId);
        this.isWebsiteOnlyCup = CupUtils.isOnlyOnWebsite(newMainState.browsingCupId, DeploymentUtils.isExtension());
      },
      deep: true
    }
  },
  async mounted() {
    this.cupName = CupUtils.getCupName(this.mainState.browsingCupId);
    this.cupImageUrl = CupUtils.getCupSkinUrl(this.mainState.browsingCupId);
    this.mapListings = MapUtils.getMapListings(this.mainState.browsingCupId);
    this.isWebsiteOnlyCup = CupUtils.isOnlyOnWebsite(this.mainState.browsingCupId, DeploymentUtils.isExtension());
    this.getBrewListings();
  },
  components: { VMapListing, VSticky, VBrewListing }
});
const _imports_0$1 = "/assets/svgs/skins.svg";
const _imports_1$1 = "/assets/svgs/finder.svg";
const _imports_2 = "/assets/svgs/settings.svg";
const _imports_3 = "/assets/svgs/multiplayer.svg";
const _imports_4 = "/assets/svgs/sync.svg";
const _imports_5 = "/assets/svgs/caret-left-fill.svg";
const _imports_6 = "/assets/svgs/caret-right-fill.svg";
const _imports_8 = "/assets/icons/discord.svg";
const _imports_9 = "/assets/icons/instagram.svg";
const VMenu_vue_vue_type_style_index_0_scoped_c2338e83_lang = "";
const _withScopeId$6 = (n2) => (pushScopeId("data-v-c2338e83"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$a = { class: "menuMain" };
const _hoisted_2$a = { class: "pageNav noHighlight" };
const _hoisted_3$a = { class: "cupArea noHighlight" };
const _hoisted_4$7 = ["src"];
const _hoisted_5$6 = { class: "topAreaContents" };
const _hoisted_6$5 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("div", { class: "topAreaSpacerRow" }, null, -1));
const _hoisted_7$5 = { class: "topAreaUpperRow" };
const _hoisted_8$5 = { class: "cupName" };
const _hoisted_9$3 = {
  key: 0,
  class: "isWebsiteOnlyCup"
};
const _hoisted_10$1 = { class: "topAreaMiddleRow" };
const _hoisted_11$1 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("div", { class: "topAreaSpacerColumn" }, null, -1));
const _hoisted_12$1 = {
  key: 0,
  class: "cupChangeArrowContainer"
};
const _hoisted_13$1 = { class: "mainPlayButtonContainer" };
const _hoisted_14$1 = {
  key: 1,
  class: "cupChangeArrowContainer"
};
const _hoisted_15$1 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("div", { class: "topAreaSpacerColumn" }, null, -1));
const _hoisted_16$1 = { class: "topAreaLowerRow" };
const _hoisted_17$1 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("div", { class: "topAreaSpacerColumn" }, null, -1));
const _hoisted_18$1 = { class: "cupStatPoints" };
const _hoisted_19$1 = {
  key: 0,
  class: "cupImageSmallContainer"
};
const _hoisted_20$1 = ["src"];
const _hoisted_21$1 = { class: "cupStatPercent" };
const _hoisted_22$1 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("div", { class: "topAreaSpacerColumn" }, null, -1));
const _hoisted_23$1 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("div", { class: "topAreaSpacerRow" }, null, -1));
const _hoisted_24$1 = { key: 0 };
const _hoisted_25$1 = { class: "textArial" };
const _hoisted_26$1 = { key: 1 };
const _hoisted_27$1 = {
  key: 2,
  class: "footer"
};
const _hoisted_28$1 = {
  key: 3,
  class: "footer"
};
const _hoisted_29$1 = ["href"];
const _hoisted_30$1 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("a", {
  class: "buttonSmall",
  href: "https://onionfist.com/",
  target: "_blank"
}, "More games like this", -1));
const _hoisted_31$1 = { class: "socialIcons" };
const _hoisted_32 = ["href"];
const _hoisted_33 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_8,
  alt: "discord"
}, null, -1));
const _hoisted_34 = [
  _hoisted_33
];
const _hoisted_35 = ["href"];
const _hoisted_36 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_9,
  alt: "instagram"
}, null, -1));
const _hoisted_37 = [
  _hoisted_36
];
const _hoisted_38 = { class: "footer" };
const _hoisted_39 = { class: "textSmall colorGray3" };
const _hoisted_40 = ["href"];
const _hoisted_41 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("span", { style: { "margin": "0px 10px" } }, "|", -1));
const _hoisted_42 = ["href"];
const _hoisted_43 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("p", { class: "textSmall colorGray3" }, [
  /* @__PURE__ */ createBaseVNode("span", null, "Onionfist 2023 | All Rights Reserved"),
  /* @__PURE__ */ createBaseVNode("br"),
  /* @__PURE__ */ createBaseVNode("span", null, "Ice Dodo Version 0.181")
], -1));
const _hoisted_44 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VBrewListing = resolveComponent("VBrewListing");
  const _component_VMapListing = resolveComponent("VMapListing");
  const _component_VSticky = resolveComponent("VSticky");
  return openBlock(), createElementBlock("main", _hoisted_1$a, [
    createBaseVNode("div", _hoisted_2$a, [
      createBaseVNode("img", {
        class: "noDrag hoverGrow",
        src: _imports_0$1,
        onClick: _cache[0] || (_cache[0] = () => _ctx.changePageId(_ctx.PageIdEnum.Skins))
      }),
      !_ctx.mainState.isNewcomer ? (openBlock(), createElementBlock("img", {
        key: 0,
        class: "noDrag hoverGrow",
        src: _imports_1$1,
        onClick: _cache[1] || (_cache[1] = () => _ctx.changePageId(_ctx.PageIdEnum.Finder))
      })) : createCommentVNode("", true),
      createBaseVNode("img", {
        class: "noDrag hoverGrow",
        src: _imports_2,
        onClick: _cache[2] || (_cache[2] = () => _ctx.changePageId(_ctx.PageIdEnum.Settings))
      }),
      !_ctx.mainState.isNewcomer ? (openBlock(), createElementBlock("img", {
        key: 1,
        class: "noDrag hoverGrow",
        src: _imports_3,
        onClick: _cache[3] || (_cache[3] = (...args) => _ctx.onClickMultiplayer && _ctx.onClickMultiplayer(...args))
      })) : createCommentVNode("", true),
      createBaseVNode("img", {
        class: "noDrag hoverGrow",
        src: _imports_4,
        onClick: _cache[4] || (_cache[4] = (...args) => _ctx.onClickSync && _ctx.onClickSync(...args))
      })
    ]),
    createBaseVNode("div", _hoisted_3$a, [
      createBaseVNode("img", {
        class: "cupImageBlurred",
        src: _ctx.cupImageUrl
      }, null, 8, _hoisted_4$7),
      createBaseVNode("div", _hoisted_5$6, [
        _hoisted_6$5,
        createBaseVNode("div", _hoisted_7$5, [
          createBaseVNode("h1", _hoisted_8$5, [
            createBaseVNode("span", null, toDisplayString(_ctx.cupName), 1),
            _ctx.isWebsiteOnlyCup ? (openBlock(), createElementBlock("span", _hoisted_9$3, "Online")) : createCommentVNode("", true)
          ])
        ]),
        createBaseVNode("div", _hoisted_10$1, [
          _hoisted_11$1,
          !_ctx.mainState.isNewcomer ? (openBlock(), createElementBlock("div", _hoisted_12$1, [
            createBaseVNode("img", {
              class: "cupChangeArrow noDrag hoverGrow",
              src: _imports_5,
              onClick: _cache[5] || (_cache[5] = () => _ctx.onClickChangeCup(-1)),
              alt: "left"
            })
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_13$1, [
            createBaseVNode("div", {
              onClick: _cache[6] || (_cache[6] = (...args) => _ctx.onClickPlayButton && _ctx.onClickPlayButton(...args)),
              class: normalizeClass(["buttonLarge hoverPink", { colorRed: !_ctx.mainState.isUltrahardUnlocked && _ctx.mainState.browsingCupId === _ctx.CupIdEnum.Ultrahard }])
            }, " PLAY ", 2)
          ]),
          !_ctx.mainState.isNewcomer ? (openBlock(), createElementBlock("div", _hoisted_14$1, [
            createBaseVNode("img", {
              class: "cupChangeArrow noDrag hoverGrow",
              src: _imports_6,
              onClick: _cache[7] || (_cache[7] = () => _ctx.onClickChangeCup(1)),
              alt: "right"
            })
          ])) : (openBlock(), createElementBlock("img", {
            key: 2,
            class: "noDrag hoverGrow newcomerHelpButton",
            src: _imports_7$1,
            onClick: _cache[8] || (_cache[8] = (...args) => _ctx.onClickNewcomerHelpButton && _ctx.onClickNewcomerHelpButton(...args)),
            alt: "help button"
          })),
          _hoisted_15$1
        ]),
        createBaseVNode("div", _hoisted_16$1, [
          _hoisted_17$1,
          createBaseVNode("h2", _hoisted_18$1, toDisplayString(_ctx.mainState.mainProgressState.cupProgressDictionary[_ctx.mainState.browsingCupId].totalPoints) + " pt", 1),
          !_ctx.mainState.isNewcomer ? (openBlock(), createElementBlock("div", _hoisted_19$1, [
            createBaseVNode("img", {
              class: "cupImageSmall noDrag hoverGrow",
              onClick: _cache[9] || (_cache[9] = () => _ctx.changePageId(_ctx.PageIdEnum.Cups)),
              src: _ctx.cupImageUrl
            }, null, 8, _hoisted_20$1)
          ])) : createCommentVNode("", true),
          createBaseVNode("h2", _hoisted_21$1, toDisplayString(_ctx.ProgressUtils.getPercentTextFromProgress(_ctx.mainState.mainProgressState.cupProgressDictionary[_ctx.mainState.browsingCupId])), 1),
          _hoisted_22$1
        ]),
        _hoisted_23$1
      ])
    ]),
    _ctx.mainState.browsingCupId === _ctx.CupIdEnum.Brew ? (openBlock(), createElementBlock("div", _hoisted_24$1, [
      createBaseVNode("div", _hoisted_25$1, toDisplayString(_ctx.brewLoadText), 1),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.brewListings, (brewListing) => {
        return openBlock(), createElementBlock("div", {
          key: brewListing.mapId
        }, [
          createVNode(_component_VBrewListing, {
            brewListing,
            onCreatePopupItem: _ctx.createPopupItem,
            onOnClickMap: _ctx.onClickMap
          }, null, 8, ["brewListing", "onCreatePopupItem", "onOnClickMap"])
        ]);
      }), 128))
    ])) : (openBlock(), createElementBlock("div", _hoisted_26$1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.mapListings, (mapListing) => {
        return openBlock(), createElementBlock("div", {
          key: mapListing.mapId
        }, [
          createVNode(_component_VMapListing, {
            mainState: _ctx.mainState,
            mapListing,
            onCreatePopupItem: _ctx.createPopupItem,
            onOnClickMap: _ctx.onClickMap
          }, null, 8, ["mainState", "mapListing", "onCreatePopupItem", "onOnClickMap"])
        ]);
      }), 128))
    ])),
    _ctx.mainState.isNewcomer ? (openBlock(), createElementBlock("div", _hoisted_27$1, [
      createBaseVNode("div", {
        class: "buttonSmall",
        onClick: _cache[10] || (_cache[10] = (...args) => _ctx.onClickNewcomerHelpButton && _ctx.onClickNewcomerHelpButton(...args))
      }, "How to Play"),
      createBaseVNode("div", {
        class: "buttonSmall",
        onClick: _cache[11] || (_cache[11] = () => _ctx.changePageId(_ctx.PageIdEnum.Credits))
      }, "Credits")
    ])) : (openBlock(), createElementBlock("div", _hoisted_28$1, [
      createBaseVNode("div", {
        class: "buttonSmall",
        onClick: _cache[12] || (_cache[12] = () => _ctx.changePageId(_ctx.PageIdEnum.Cups))
      }, "More maps"),
      createBaseVNode("div", {
        class: "buttonSmall",
        onClick: _cache[13] || (_cache[13] = () => _ctx.changePageId(_ctx.PageIdEnum.Credits))
      }, "Credits"),
      createBaseVNode("a", {
        class: "buttonSmall",
        href: _ctx.LinkEnum.IceDodoOnWebstore,
        target: "_blank"
      }, "Please rate 5 stars", 8, _hoisted_29$1),
      _hoisted_30$1,
      createBaseVNode("div", {
        class: "buttonSmall",
        onClick: _cache[14] || (_cache[14] = () => _ctx.changePageId(_ctx.PageIdEnum.Achievements))
      }, " View achievements "),
      createBaseVNode("div", _hoisted_31$1, [
        createBaseVNode("a", {
          class: "socialIcon",
          href: _ctx.LinkEnum.Discord,
          target: "_blank"
        }, _hoisted_34, 8, _hoisted_32),
        createBaseVNode("a", {
          class: "socialIcon",
          href: _ctx.LinkEnum.Instagram,
          target: "_blank"
        }, _hoisted_37, 8, _hoisted_35)
      ])
    ])),
    createBaseVNode("div", _hoisted_38, [
      createBaseVNode("p", _hoisted_39, [
        createBaseVNode("a", {
          class: "clickableText",
          href: _ctx.LinkEnum.PrivacyPolicy
        }, "Privacy Policy", 8, _hoisted_40),
        _hoisted_41,
        createBaseVNode("a", {
          class: "clickableText",
          href: _ctx.LinkEnum.TermsOfService
        }, "Terms of Service", 8, _hoisted_42)
      ]),
      _hoisted_43,
      _hoisted_44
    ]),
    createVNode(_component_VSticky)
  ]);
}
const VMenu = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-c2338e83"]]);
const _sfc_main$9 = defineComponent({
  data() {
    return {};
  },
  methods: {
    onClickMenuButton() {
      this.$emit("onClickMenuButton");
    }
  },
  mounted() {
  }
});
const _imports_0 = "/assets/svgs/back_arrow.svg";
const VCredits_vue_vue_type_style_index_0_scoped_c7113168_lang = "";
const _withScopeId$5 = (n2) => (pushScopeId("data-v-c7113168"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$9 = { class: "titleWithIcon" };
const _hoisted_2$9 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge" }, "Credits", -1));
const _hoisted_3$9 = /* @__PURE__ */ createStaticVNode('<div class="creditsMain" data-v-c7113168><p class="textLarge" data-v-c7113168>Ice Dodo Developer</p><p class="textArial" data-v-c7113168>Jason</p><p class="textLarge" data-v-c7113168>DodoLoader Developer</p><p class="textArial" data-v-c7113168>Guy</p><ul style="text-align:left;" data-v-c7113168><li data-v-c7113168>Email: flyingdodo9000@gmail.com</li><li data-v-c7113168><span data-v-c7113168>Instagram:</span><a href="https://www.instagram.com/seojoon.y/" target="_blank" class="clickableText textArial" data-v-c7113168>@seojoon.y [CLICK]</a></li></ul><p class="textLarge" data-v-c7113168>Music</p><p class="textArial" data-v-c7113168>Valkyrie, Peneumatic Tokyo, Stairways, Uprise and Bloom by EnV</p><p class="textArial" data-v-c7113168>Ice Dodo Theme and Down Caves by ColBreakz</p><p class="textArial" data-v-c7113168>Dodozart, Dodosynthesis and Brink by The Insolence Watches You</p><p class="textLarge" data-v-c7113168>Map makers</p><p class="textArial" data-v-c7113168>!Vanta!, rytai3, ABC123, aethertrix, applepear, A KittenIsh Exponent, AnimeFan, anperson, asfhgsfhkj, awehero, bean, Bearded Baby, Bumpo, Burgerhero48, Butta_Knife, Carrots, catfishpie, cfurby27, ChappJack, Cr43zy, Dabossgama, DaEpicDuck, Dancing Axolotl, Darrk_77, datoneguy246, David Ye, DestroyerBall, Dododo73, DONKEYDUO, DonW15, DRV, EpicTaco, FNX, Ghoullsh, Gold3n d0d0, happyhockey, Hamster D0D0, Have2go2p, heck, Helloe, Hotdoggo, Ice Chicken, ItsDukki, jaspko, jay, Jerwo, June, Kazil, LEo, Liam, lil_debbie68, mapleandco.mapmaking, Maplez, massdebater6969, MasterMinx9000, Matt B, Milesrad, Moose_ManOK, MooshMM, MrMaas, MTHW, Neonturtle, Ninjisawesome, P!%89, Painkiller, PepsiPenguin, Possible Panda, Racoonboy2123, Revelboy, Rionte, RobotDestroyer39, rocky707, skilledandkilled, Skywolf, SourLemons, Soviet Coconut, Squirrel, Stevo, Sungjoon, SupaSnugz, TesT, The Insolence Watches You, Thero, TimTam, TomTEC, unfortxnate, uPilot, Usern, Waffle, Wienerdog, wuk903, Xdoomination, Zhou Yu, Zoni</p><p class="textLarge" data-v-c7113168>Pixel art</p><p class="textArial" data-v-c7113168>ItsYaBoiPoppin, Furby, Bumpo, Daniel, The Unsuspicious Imposter, anperson, Thero, Catfishpie, The Insolence Watches You, legendofme, supasnugz, ABC123, donkeyduo, beanos, FNX, Shogun, Future Pro, JayTheMystic, Destroyer, dwn, Ghoul, dwn, jAy, Unknown66, thezoomerguy, RunningOutOfSpaceToTypeInMyUsern, hotasiankid, skilledandkilled, Rocky707, Maplette, TemChez</p><p class="textLarge" data-v-c7113168>Special thanks</p><p class="textArial" data-v-c7113168>Furby, sungjoon, parke, sleepyhatake, skywolf, masterclutch, Golden, Rocky707, Thero, Jerome, Yusof</p><p class="textLarge" data-v-c7113168>Partners</p><p class="textArial" data-v-c7113168>Doppler, Kristian</p></div>', 1);
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", null, [
    createBaseVNode("div", _hoisted_1$9, [
      createBaseVNode("img", {
        src: _imports_0,
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickMenuButton && _ctx.onClickMenuButton(...args))
      }),
      _hoisted_2$9
    ]),
    _hoisted_3$9
  ]);
}
const VCredits = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-c7113168"]]);
const _sfc_main$8 = defineComponent({
  props: {
    settingsItem: {
      type: Object,
      required: true
    },
    mainState: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      currentStorageValue: null
    };
    return data;
  },
  watch: {
    mainState: {
      handler: async function(newMainState) {
        if (newMainState.pageId !== PageIdEnum.Settings)
          return;
        this.currentStorageValue = await FStorage.getString(this.settingsItem.storageKey);
      },
      deep: true
    }
  },
  methods: {
    async onClickButton(newStorageValue) {
      this.currentStorageValue = newStorageValue;
      SettingsUtils.setSettingsItemGlobalVariable(this.settingsItem, newStorageValue);
      this.$emit("onSettingsItemChanged", this.settingsItem, newStorageValue);
      await FStorage.set(this.settingsItem.storageKey, newStorageValue);
    }
  },
  async mounted() {
    this.currentStorageValue = await FStorage.getString(this.settingsItem.storageKey);
  }
});
const VSettingsItem_vue_vue_type_style_index_0_scoped_bb523b26_lang = "";
const _hoisted_1$8 = {
  key: 0,
  class: "settingsItemMain"
};
const _hoisted_2$8 = { class: "textSmall" };
const _hoisted_3$8 = ["onClick"];
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.currentStorageValue != null ? (openBlock(), createElementBlock("main", _hoisted_1$8, [
    createBaseVNode("p", _hoisted_2$8, toDisplayString(_ctx.settingsItem.name), 1),
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.settingsItem.storageValues, (storageValue) => {
      return openBlock(), createElementBlock("div", {
        key: storageValue,
        class: normalizeClass([{ isSelectedButton: storageValue === _ctx.currentStorageValue }, "buttonSmall"]),
        onClick: () => _ctx.onClickButton(storageValue)
      }, toDisplayString(storageValue), 11, _hoisted_3$8);
    }), 128))
  ])) : createCommentVNode("", true);
}
const VSettingsItemVue = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-bb523b26"]]);
const _sfc_main$7 = defineComponent({
  props: {
    mainState: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      StorageKeyEnum,
      StorageValueEnum,
      isExtension: DeploymentUtils.isExtension(),
      allSettingsItems: SettingsUtils.getAllSettingsItemsExceptResolutionIfExtension()
    };
    return data;
  },
  methods: {
    onClickMenuButton() {
      this.$emit("onClickMenuButton");
    },
    onSettingsItemChanged(settingsItem, newStorageValue) {
      this.$emit("onSettingsItemChanged", settingsItem, newStorageValue);
    }
  },
  async mounted() {
  },
  components: { VSettingsItemVue }
});
const VSettings_vue_vue_type_style_index_0_scoped_c12264ba_lang = "";
const _withScopeId$4 = (n2) => (pushScopeId("data-v-c12264ba"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$7 = { class: "titleWithIcon" };
const _hoisted_2$7 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge" }, "Settings", -1));
const _hoisted_3$7 = { class: "settingsMain" };
const _hoisted_4$6 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VSettingsItemVue = resolveComponent("VSettingsItemVue");
  return openBlock(), createElementBlock("main", null, [
    createBaseVNode("div", _hoisted_1$7, [
      createBaseVNode("img", {
        src: _imports_0,
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickMenuButton && _ctx.onClickMenuButton(...args))
      }),
      _hoisted_2$7
    ]),
    createBaseVNode("div", _hoisted_3$7, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.allSettingsItems, (settingsItem) => {
        return openBlock(), createElementBlock("div", {
          key: settingsItem.storageKey
        }, [
          createVNode(_component_VSettingsItemVue, {
            settingsItem,
            mainState: _ctx.mainState,
            onOnSettingsItemChanged: _ctx.onSettingsItemChanged
          }, null, 8, ["settingsItem", "mainState", "onOnSettingsItemChanged"])
        ]);
      }), 128)),
      _hoisted_4$6
    ])
  ]);
}
const VSettings = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-c12264ba"]]);
const _sfc_main$6 = defineComponent({
  data() {
    const data = {
      ALL_CUP_IDS,
      CupUtils,
      selectedCupName: "Choose a cup",
      isSelectedCupOnlyOnWebsite: false,
      selectedCupDescription: "??"
    };
    return data;
  },
  methods: {
    onClickMenuButton() {
      this.selectedCupName = "Choose a cup";
      this.$emit("onClickMenuButton");
    },
    goToCupInMenu(cupId) {
      this.$emit("goToCupInMenu", cupId);
    },
    onHoverCup(cupId) {
      this.selectedCupName = CupUtils.getCupName(cupId);
      this.isSelectedCupOnlyOnWebsite = CupUtils.isOnlyOnWebsite(cupId, DeploymentUtils.isExtension());
      this.selectedCupDescription = CupUtils.getCupDescription(cupId);
    }
  },
  async mounted() {
  }
});
const VCups_vue_vue_type_style_index_0_scoped_78871864_lang = "";
const _withScopeId$3 = (n2) => (pushScopeId("data-v-78871864"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$6 = { class: "titleWithIcon" };
const _hoisted_2$6 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge" }, "Cups", -1));
const _hoisted_3$6 = { class: "cupsMain" };
const _hoisted_4$5 = { class: "textLarge" };
const _hoisted_5$5 = {
  key: 0,
  class: "isWebsiteOnlyCup"
};
const _hoisted_6$4 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_7$4 = ["src", "onMouseover", "onClick"];
const _hoisted_8$4 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_9$2 = { class: "cupDescription textArial" };
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", null, [
    createBaseVNode("div", _hoisted_1$6, [
      createBaseVNode("img", {
        src: _imports_0,
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickMenuButton && _ctx.onClickMenuButton(...args))
      }),
      _hoisted_2$6
    ]),
    createBaseVNode("div", _hoisted_3$6, [
      createBaseVNode("h2", _hoisted_4$5, [
        createBaseVNode("span", null, toDisplayString(_ctx.selectedCupName), 1),
        _ctx.isSelectedCupOnlyOnWebsite ? (openBlock(), createElementBlock("span", _hoisted_5$5, "Online")) : createCommentVNode("", true)
      ]),
      _hoisted_6$4,
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.ALL_CUP_IDS, (cupId) => {
        return openBlock(), createElementBlock("div", {
          class: "cupIcon",
          key: cupId
        }, [
          createBaseVNode("img", {
            src: _ctx.CupUtils.getCupSkinUrl(cupId),
            class: "hoverGrow",
            onMouseover: () => _ctx.onHoverCup(cupId),
            onClick: () => _ctx.goToCupInMenu(cupId)
          }, null, 40, _hoisted_7$4)
        ]);
      }), 128)),
      _hoisted_8$4,
      createBaseVNode("p", _hoisted_9$2, toDisplayString(_ctx.selectedCupDescription), 1)
    ])
  ]);
}
const VCups = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-78871864"]]);
const PROGRESS_BAR_MAX_WIDTH_PX$1 = 250;
const _sfc_main$5 = defineComponent({
  props: {
    progressTextName: {
      type: String,
      required: true
    },
    progress: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      ProgressUtils
    };
    return data;
  },
  methods: {
    getProgressBarWidth(percent) {
      return Math.min(PROGRESS_BAR_MAX_WIDTH_PX$1, percent * PROGRESS_BAR_MAX_WIDTH_PX$1) + "px";
    },
    getPercent() {
      return this.progress.completedMaps / this.progress.totalMaps;
    }
  }
});
const VAchievementsRow_vue_vue_type_style_index_0_scoped_d9dd273d_lang = "";
const _hoisted_1$5 = { class: "achievementsRowMain" };
const _hoisted_2$5 = { class: "progressText" };
const _hoisted_3$5 = { class: "textSmall progressTextName" };
const _hoisted_4$4 = { class: "textSmall progressTextPoints" };
const _hoisted_5$4 = { class: "textSmall progressTextPercent" };
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", _hoisted_1$5, [
    createBaseVNode("div", _hoisted_2$5, [
      createBaseVNode("span", _hoisted_3$5, toDisplayString(_ctx.progressTextName), 1),
      createBaseVNode("span", _hoisted_4$4, toDisplayString(_ctx.progress.totalPoints) + " pt", 1),
      createBaseVNode("span", _hoisted_5$4, toDisplayString(_ctx.ProgressUtils.getPercentTextFromProgress(_ctx.progress)), 1)
    ]),
    createBaseVNode("div", {
      class: "progressBarOuter",
      style: normalizeStyle({ width: _ctx.getProgressBarWidth(1) })
    }, [
      createBaseVNode("div", {
        class: "progressBarInner",
        style: normalizeStyle({ width: _ctx.getProgressBarWidth(_ctx.getPercent()) })
      }, null, 4)
    ], 4)
  ]);
}
const VAchievementsRow = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-d9dd273d"]]);
const PROGRESS_BAR_MAX_WIDTH_PX = 250;
const _sfc_main$4 = defineComponent({
  props: {
    mainState: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      ALL_CUP_IDS,
      CupUtils,
      overallPoints: 0,
      overallPercent: 0
    };
    return data;
  },
  methods: {
    onClickMenuButton() {
      this.$emit("onClickMenuButton");
    },
    getProgressBarWidth(percent) {
      return Math.min(PROGRESS_BAR_MAX_WIDTH_PX, percent * PROGRESS_BAR_MAX_WIDTH_PX) + "px";
    },
    getPercent(cupProgress) {
      return cupProgress.completedMaps / cupProgress.totalMaps;
    }
  },
  components: { VAchievementsRow }
});
const VAchievements_vue_vue_type_style_index_0_scoped_05212022_lang = "";
const _withScopeId$2 = (n2) => (pushScopeId("data-v-05212022"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$4 = { class: "titleWithIcon" };
const _hoisted_2$4 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge" }, "Achievements", -1));
const _hoisted_3$4 = { class: "achievementsMain" };
const _hoisted_4$3 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge colorPink" }, "Overall", -1));
const _hoisted_5$3 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("p", { class: "textSmall" }, "Note: Vault cup not included", -1));
const _hoisted_6$3 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("div", { class: "achievementsSpacer" }, null, -1));
const _hoisted_7$3 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge colorPink" }, "By Cup", -1));
const _hoisted_8$3 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("div", { class: "achievementsSpacer" }, null, -1));
const _hoisted_9$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge colorPink" }, "By Difficulty", -1));
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VAchievementsRow = resolveComponent("VAchievementsRow");
  return openBlock(), createElementBlock("main", null, [
    createBaseVNode("div", _hoisted_1$4, [
      createBaseVNode("img", {
        src: _imports_0,
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickMenuButton && _ctx.onClickMenuButton(...args))
      }),
      _hoisted_2$4
    ]),
    createBaseVNode("div", _hoisted_3$4, [
      _hoisted_4$3,
      createBaseVNode("div", null, [
        createVNode(_component_VAchievementsRow, {
          progressTextName: "Overall",
          progress: _ctx.mainState.mainProgressState.overallProgress
        }, null, 8, ["progress"]),
        _hoisted_5$3
      ]),
      _hoisted_6$3,
      _hoisted_7$3,
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.ALL_CUP_IDS, (cupId) => {
        return openBlock(), createElementBlock("div", { key: cupId }, [
          createVNode(_component_VAchievementsRow, {
            progressTextName: _ctx.CupUtils.getCupName(cupId),
            progress: _ctx.mainState.mainProgressState.cupProgressDictionary[cupId]
          }, null, 8, ["progressTextName", "progress"])
        ]);
      }), 128)),
      _hoisted_8$3,
      _hoisted_9$1,
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.mainState.mainProgressState.diffProgressDictionary, (diffProgress, difficulty) => {
        return openBlock(), createElementBlock("div", { key: difficulty }, [
          createVNode(_component_VAchievementsRow, {
            progressTextName: "Diff " + difficulty,
            progress: diffProgress
          }, null, 8, ["progressTextName", "progress"])
        ]);
      }), 128))
    ])
  ]);
}
const VAchievements = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-05212022"]]);
var SearchMethodEnum = /* @__PURE__ */ ((SearchMethodEnum2) => {
  SearchMethodEnum2[SearchMethodEnum2["Name"] = 0] = "Name";
  SearchMethodEnum2[SearchMethodEnum2["Difficulty"] = 1] = "Difficulty";
  SearchMethodEnum2[SearchMethodEnum2["New"] = 2] = "New";
  SearchMethodEnum2[SearchMethodEnum2["Favorite"] = 3] = "Favorite";
  SearchMethodEnum2[SearchMethodEnum2["Unbeaten"] = 4] = "Unbeaten";
  SearchMethodEnum2[SearchMethodEnum2["Random"] = 5] = "Random";
  return SearchMethodEnum2;
})(SearchMethodEnum || {});
const _sfc_main$3 = defineComponent({
  props: {
    mainState: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      searchTerm: "",
      mapListingsFromSearch: [],
      errorFromSearch: null,
      difficulties: ALL_DIFFICULTIES,
      SearchMethodEnum,
      selectedSearchMethod: 0,
      ALL_SEARCH_METHODS: MiscUtils.getNumberEnumKeys(SearchMethodEnum),
      FINDER_MAX_RESULTS
    };
    return data;
  },
  methods: {
    onClickMenuButton() {
      this.$emit("onClickMenuButton");
    },
    getSearchResults() {
      const searchTermValue = this.searchTerm.trim().toLowerCase();
      if (searchTermValue.length === 0)
        throw new Error("Search term is empty");
      const searchResults = [];
      for (const cupId of ALL_CUP_IDS) {
        const mapListings = MapUtils.getMapListings(cupId);
        for (const mapListing of mapListings) {
          if (MapUtils.doesContain(searchResults, mapListing))
            continue;
          if (mapListing.name.toLowerCase().includes(searchTermValue)) {
            searchResults.push(mapListing);
            continue;
          }
          if (mapListing.mapId.toLowerCase().includes(searchTermValue)) {
            searchResults.push(mapListing);
            continue;
          }
        }
      }
      if (searchResults.length > FINDER_MAX_RESULTS)
        throw new Error("Too many search results. Please be more specific");
      return searchResults;
    },
    onClickDifficulty(difficulty) {
      this.mapListingsFromSearch = MapUtils.getAllMapListingsOfDifficulty(difficulty, true);
      this.errorFromSearch = null;
    },
    onClickSearch() {
      try {
        this.mapListingsFromSearch = this.getSearchResults();
        this.errorFromSearch = null;
      } catch (error) {
        this.mapListingsFromSearch = [];
        this.errorFromSearch = error.message;
      }
    },
    onClickMap(mapListing) {
      this.$emit("onClickMap", mapListing);
    },
    createPopupItem(popupItem) {
      this.$emit("createPopupItem", popupItem);
    },
    getSearchMethodName(searchMethod) {
      return SearchMethodEnum[searchMethod];
    },
    async onClickSearchMethod(searchMethod) {
      this.selectedSearchMethod = searchMethod;
      this.errorFromSearch = null;
      this.mapListingsFromSearch = await this.getMapListingsAfterChangingMethod();
    },
    async getMapListingsAfterChangingMethod() {
      switch (this.selectedSearchMethod) {
        case 2:
          return RecentMapUtils.getRecentMapListings();
        case 3:
          return RecentMapUtils.getFavoriteMapListings();
        case 4:
          return CompletedMapUtils.getUnbeatenMapListings(this.mainState.mapCompletionDictionary);
        case 5:
          return [MapUtils.getRandomMapListing()];
        case 0:
        case 1:
          return [];
      }
    }
  },
  async mounted() {
  },
  components: { VMapListing }
});
const VFinder_vue_vue_type_style_index_0_scoped_0d1be72d_lang = "";
const _withScopeId$1 = (n2) => (pushScopeId("data-v-0d1be72d"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$3 = { class: "titleWithIcon" };
const _hoisted_2$3 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge" }, "Map Search", -1));
const _hoisted_3$3 = { class: "finderMain" };
const _hoisted_4$2 = { class: "searchMethodRow" };
const _hoisted_5$2 = ["onClick"];
const _hoisted_6$2 = { key: 0 };
const _hoisted_7$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "textArial" }, "Enter Map Name or ID", -1));
const _hoisted_8$2 = { class: "searchInputRow" };
const _hoisted_9 = { key: 1 };
const _hoisted_10 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "textArial" }, "Maps recently added to the game.", -1));
const _hoisted_11 = [
  _hoisted_10
];
const _hoisted_12 = { key: 2 };
const _hoisted_13 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "textArial" }, "Maps that you rated 5 stars. To use this feature: Go to the menu screen, Sign in with Google in the Sync tab, and then leave a map review!", -1));
const _hoisted_14 = [
  _hoisted_13
];
const _hoisted_15 = { key: 3 };
const _hoisted_16 = { class: "textArial" };
const _hoisted_17 = { key: 4 };
const _hoisted_18 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "textArial" }, "Recommends totally random maps.", -1));
const _hoisted_19 = [
  _hoisted_18
];
const _hoisted_20 = { key: 5 };
const _hoisted_21 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "textArial" }, "Choose Difficulty", -1));
const _hoisted_22 = ["onClick"];
const _hoisted_23 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1));
const _hoisted_24 = { key: 6 };
const _hoisted_25 = { class: "textArial finderError" };
const _hoisted_26 = { key: 7 };
const _hoisted_27 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("h2", { class: "textArial" }, "No results", -1));
const _hoisted_28 = [
  _hoisted_27
];
const _hoisted_29 = { key: 8 };
const _hoisted_30 = { class: "textArial" };
const _hoisted_31 = { key: 0 };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VMapListing = resolveComponent("VMapListing");
  return openBlock(), createElementBlock("main", null, [
    createBaseVNode("div", _hoisted_1$3, [
      createBaseVNode("img", {
        src: _imports_0,
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickMenuButton && _ctx.onClickMenuButton(...args))
      }),
      _hoisted_2$3
    ]),
    createBaseVNode("div", _hoisted_3$3, [
      createBaseVNode("div", _hoisted_4$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.ALL_SEARCH_METHODS, (searchMethod) => {
          return openBlock(), createElementBlock("div", {
            key: searchMethod,
            class: normalizeClass(["buttonSmall noHighlight", { isSelectedButton: _ctx.selectedSearchMethod === searchMethod }]),
            onClick: () => _ctx.onClickSearchMethod(searchMethod)
          }, toDisplayString(_ctx.getSearchMethodName(searchMethod)), 11, _hoisted_5$2);
        }), 128))
      ]),
      _ctx.selectedSearchMethod === _ctx.SearchMethodEnum.Name ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
        _hoisted_7$2,
        createBaseVNode("div", _hoisted_8$2, [
          withDirectives(createBaseVNode("input", {
            class: "inputSmall",
            type: "text",
            maxlength: "16",
            onKeyup: _cache[1] || (_cache[1] = withKeys((...args) => _ctx.onClickSearch && _ctx.onClickSearch(...args), ["enter"])),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.searchTerm = $event)
          }, null, 544), [
            [vModelText, _ctx.searchTerm]
          ]),
          createBaseVNode("div", {
            class: "buttonSmall",
            onClick: _cache[3] || (_cache[3] = (...args) => _ctx.onClickSearch && _ctx.onClickSearch(...args))
          }, "Search")
        ])
      ])) : _ctx.selectedSearchMethod === _ctx.SearchMethodEnum.New ? (openBlock(), createElementBlock("div", _hoisted_9, _hoisted_11)) : _ctx.selectedSearchMethod === _ctx.SearchMethodEnum.Favorite ? (openBlock(), createElementBlock("div", _hoisted_12, _hoisted_14)) : _ctx.selectedSearchMethod === _ctx.SearchMethodEnum.Unbeaten ? (openBlock(), createElementBlock("div", _hoisted_15, [
        createBaseVNode("p", _hoisted_16, "Maps you haven't completed yet. Shows " + toDisplayString(_ctx.FINDER_MAX_RESULTS) + " results max.", 1)
      ])) : _ctx.selectedSearchMethod === _ctx.SearchMethodEnum.Random ? (openBlock(), createElementBlock("div", _hoisted_17, _hoisted_19)) : _ctx.selectedSearchMethod === _ctx.SearchMethodEnum.Difficulty ? (openBlock(), createElementBlock("div", _hoisted_20, [
        _hoisted_21,
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.difficulties, (difficulty) => {
          return openBlock(), createElementBlock("div", {
            class: "buttonSmall difficultyButton",
            onClick: () => _ctx.onClickDifficulty(difficulty),
            key: difficulty
          }, toDisplayString(difficulty), 9, _hoisted_22);
        }), 128))
      ])) : createCommentVNode("", true),
      _hoisted_23,
      _ctx.errorFromSearch != null ? (openBlock(), createElementBlock("div", _hoisted_24, [
        createBaseVNode("h2", _hoisted_25, toDisplayString(_ctx.errorFromSearch), 1)
      ])) : _ctx.mapListingsFromSearch.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_26, _hoisted_28)) : (openBlock(), createElementBlock("div", _hoisted_29, [
        createBaseVNode("h2", _hoisted_30, "Found " + toDisplayString(_ctx.mapListingsFromSearch.length) + " results", 1),
        Object.keys(_ctx.mainState.mapCompletionDictionary).length > 0 ? (openBlock(), createElementBlock("div", _hoisted_31, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.mapListingsFromSearch, (mapListing) => {
            return openBlock(), createElementBlock("div", {
              key: mapListing.mapId
            }, [
              createVNode(_component_VMapListing, {
                mainState: _ctx.mainState,
                mapListing,
                onCreatePopupItem: _ctx.createPopupItem,
                onOnClickMap: _ctx.onClickMap
              }, null, 8, ["mainState", "mapListing", "onCreatePopupItem", "onOnClickMap"])
            ]);
          }), 128))
        ])) : createCommentVNode("", true)
      ]))
    ])
  ]);
}
const VFinder = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-0d1be72d"]]);
const SKIN_PROGRESS_BAR_MAX_WIDTH_PX = 50;
const _sfc_main$2 = defineComponent({
  props: {
    mainState: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      SkinUtils,
      selectedSkinId: SkinIdEnum.Default
    };
    return data;
  },
  methods: {
    onClickMenuButton() {
      this.$emit("onClickMenuButton");
    },
    async onClickSkin(skinId) {
      if (this.mainState.skinStateDictionary[skinId].percent < 1) {
        if (SkinUtils.isPuzzleSkin(skinId)) {
          this.createPuzzleSkinPopup(skinId);
        } else {
          this.createSkinHelpPopup(skinId);
        }
        return;
      }
      this.playClickSound();
      this.selectedSkinId = skinId;
      decorations.decorate_player(SkinUtils.getSkinImageSrc(skinId));
      await FStorage.set(StorageKeyEnum.SelectedSkinId, skinId);
    },
    playClickSound() {
      this.$emit("playClickSound");
    },
    getProgressBarWidth(percent) {
      const widthPx = percent * SKIN_PROGRESS_BAR_MAX_WIDTH_PX;
      return widthPx + "px";
    },
    createSkinHelpPopup(skinId) {
      const skinState = this.mainState.skinStateDictionary[skinId];
      const percentText = Math.round(skinState.percent * 100) + "%";
      const popupItem = {
        title: "Skin Locked",
        bodyAsHtml: `
          ${skinState.howToGet} to unlock this skin.
          <br><br>
          You are ${percentText} of the way there!
          <br>
          <img src="${SkinUtils.getSkinImageSrc(skinId)}" style="width: 100px; height: 100px; margin-top: 10px;">
        `,
        buttons: []
      };
      this.$emit("createPopupItem", popupItem);
    },
    createPuzzleSkinPopup(skinId) {
      const skinState = this.mainState.skinStateDictionary[skinId];
      const popupItem = {
        title: "Puzzle Skin",
        bodyAsHtml: `
          ${skinState.howToGet}
          <br><br>
          <img src="${SkinUtils.getSkinImageSrc(skinId)}" style="width: 100px; height: 100px; margin-top: 10px;">
          <br>
          @seojoon.y
        `,
        buttons: [{
          text: CLOSE_BUTTON_TEXT,
          onClick: () => {
          }
        }, {
          text: "Guess now",
          onClick: async () => {
            const guess = prompt("What is the secret word?");
            if (guess == null)
              return;
            if (guess.toUpperCase() != "WOOOOF") {
              alert("Wrong!");
              return;
            }
            alert("Skin unlocked!");
            await SkinUtils.unlockPuzzleSkin(skinId);
            this.$emit("reloadMainState");
          }
        }]
      };
      this.$emit("createPopupItem", popupItem);
    }
  },
  async mounted() {
    const selectedSkinId = await FStorage.getInteger(StorageKeyEnum.SelectedSkinId);
    if (selectedSkinId != null)
      this.selectedSkinId = selectedSkinId;
  }
});
const _imports_1 = "/assets/svgs/lock.svg";
const VSkins_vue_vue_type_style_index_0_scoped_1a1c1d8c_lang = "";
const _withScopeId = (n2) => (pushScopeId("data-v-1a1c1d8c"), n2 = n2(), popScopeId(), n2);
const _hoisted_1$2 = { class: "titleWithIcon" };
const _hoisted_2$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("h1", { class: "textLarge" }, "Skins", -1));
const _hoisted_3$2 = { class: "skinsMain" };
const _hoisted_4$1 = ["onClick"];
const _hoisted_5$1 = ["src"];
const _hoisted_6$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("img", {
  class: "lockImage noDrag",
  src: _imports_1
}, null, -1));
const _hoisted_7$1 = { class: "skinRightPart" };
const _hoisted_8$1 = { class: "textSmall" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", null, [
    createBaseVNode("div", _hoisted_1$2, [
      createBaseVNode("img", {
        src: _imports_0,
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickMenuButton && _ctx.onClickMenuButton(...args))
      }),
      _hoisted_2$2
    ]),
    createBaseVNode("div", _hoisted_3$2, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.mainState.skinIdsSortedByOwned, (skinId) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["skinItem noHighlight", { isLocked: _ctx.mainState.skinStateDictionary[skinId].percent < 1, isSelected: _ctx.selectedSkinId === skinId }]),
          key: skinId
        }, [
          createBaseVNode("div", {
            class: "skinLeftPart hoverGrow",
            onClick: () => _ctx.onClickSkin(skinId)
          }, [
            createBaseVNode("img", {
              class: "skinImage noDrag",
              src: _ctx.SkinUtils.getSkinImageSrc(skinId)
            }, null, 8, _hoisted_5$1),
            _hoisted_6$1
          ], 8, _hoisted_4$1),
          createBaseVNode("div", _hoisted_7$1, [
            createBaseVNode("h1", _hoisted_8$1, toDisplayString(_ctx.mainState.skinStateDictionary[skinId].name), 1),
            createBaseVNode("div", {
              class: "progressBarOuter",
              style: normalizeStyle({ width: _ctx.getProgressBarWidth(1) })
            }, [
              createBaseVNode("div", {
                class: "progressBarInner",
                style: normalizeStyle({ width: _ctx.getProgressBarWidth(_ctx.mainState.skinStateDictionary[skinId].percent) })
              }, null, 4)
            ], 4)
          ])
        ], 2);
      }), 128))
    ])
  ]);
}
const VSkins = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-1a1c1d8c"]]);
const _sfc_main$1 = defineComponent({
  props: {
    popupItem: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      CLOSE_BUTTON_TEXT
    };
    return data;
  },
  methods: {
    onPopupItemClose() {
      this.$emit("onPopupItemClose", this.popupItem.id);
      this.$emit("playClickSound");
    },
    onClickButton(button) {
      button.onClick();
      this.onPopupItemClose();
    },
    onClickCross() {
      const closeButton = this.popupItem.buttons.find((button) => button.text === CLOSE_BUTTON_TEXT);
      if (closeButton) {
        this.onClickButton(closeButton);
      } else {
        this.onPopupItemClose();
      }
    }
  },
  mounted() {
  }
});
const VPopupItem_vue_vue_type_style_index_0_scoped_defa055d_lang = "";
const _hoisted_1$1 = { class: "popupItemMain" };
const _hoisted_2$1 = { class: "popupItemRow popupItemTitle" };
const _hoisted_3$1 = { class: "textLarge" };
const _hoisted_4 = { class: "popupItemRow popupItemBody htmlContents" };
const _hoisted_5 = ["innerHTML"];
const _hoisted_6 = { class: "popupItemRow popupItemButtons" };
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { key: 0 };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", _hoisted_1$1, [
    createBaseVNode("div", _hoisted_2$1, [
      createBaseVNode("h1", _hoisted_3$1, toDisplayString(_ctx.popupItem.title), 1),
      createBaseVNode("img", {
        class: "closeButton hoverGrow noDrag",
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClickCross && _ctx.onClickCross(...args)),
        src: _imports_0$2
      })
    ]),
    createBaseVNode("div", _hoisted_4, [
      createBaseVNode("div", {
        innerHTML: _ctx.popupItem.bodyAsHtml
      }, null, 8, _hoisted_5)
    ]),
    createBaseVNode("div", _hoisted_6, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.popupItem.buttons, (button) => {
        return openBlock(), createElementBlock("div", {
          key: button.text,
          onClick: () => _ctx.onClickButton(button),
          class: "popupItemButton buttonSmall noHighlight"
        }, toDisplayString(button.text), 9, _hoisted_7);
      }), 128)),
      _ctx.popupItem.buttons.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_8, [
        createBaseVNode("div", {
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.onClickCross && _ctx.onClickCross(...args)),
          class: "popupItemButton buttonSmall noHighlight"
        }, toDisplayString(_ctx.CLOSE_BUTTON_TEXT), 1)
      ])) : createCommentVNode("", true)
    ])
  ]);
}
const VPopupItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-defa055d"]]);
const _sfc_main = defineComponent({
  data() {
    const data = {
      isLoadingMain: true,
      world: null,
      popupItemIdCounter: 0,
      PageIdEnum,
      popupItems: [],
      mainState: MainStateUtils.getInitialMainState()
    };
    return data;
  },
  methods: {
    async changeCupByDeltaIndex(deltaIndex) {
      this.playClickSound();
      this.mainState = {
        ...this.mainState,
        browsingCupId: CupUtils.getCupByDeltaIndex(this.mainState.browsingCupId, deltaIndex)
      };
      await FStorage.set(StorageKeyEnum.LastOpenedCupId, this.mainState.browsingCupId);
    },
    onClickMap(mapListing, mapUrl) {
      if (this.world == null)
        return;
      this.playClickSound();
      this.mainState = {
        ...this.mainState,
        mapListing,
        pageId: PageIdEnum.Game,
        mapUrl: mapUrl ?? null
      };
      this.world.resolutionManager.resizeScreenForGame();
      this.world.playMap(this.mainState);
      if (this.mainState.mapUrl != null)
        this.mainState.browsingCupId = CupIdEnum.Brew;
      window.currentPageId = this.mainState.pageId;
      if (window.bagManager != null) {
        window.bagManager.verticalBagManager.hideWideOnly();
        window.bagManager.verticalBagManager.showThinOnly();
      }
    },
    returnToMenuFromGame() {
      if (this.world == null)
        return;
      this.playClickSound();
      this.mainState = {
        ...this.mainState,
        mapListing: null,
        pageId: PageIdEnum.Menu
      };
      this.world.resolutionManager.resizeScreenForMenu();
      this.world.mainState = this.mainState;
      window.currentPageId = this.mainState.pageId;
      if (window.bagManager != null) {
        window.bagManager.verticalBagManager.showWideOnly();
        window.bagManager.verticalBagManager.hideThinOnly();
      }
    },
    changePageId(pageId) {
      this.playClickSound();
      this.mainState.pageId = pageId;
      const app = document.getElementById("app");
      app.scrollTo(0, 0);
      window.scrollTo(0, 0);
    },
    onClickMenuButton() {
      this.playClickSound();
      this.mainState.pageId = PageIdEnum.Menu;
    },
    async goToCupInMenu(cupId) {
      this.playClickSound();
      this.mainState = {
        ...this.mainState,
        browsingCupId: cupId,
        pageId: PageIdEnum.Menu
      };
      window.currentPageId = this.mainState.pageId;
      await FStorage.set(StorageKeyEnum.LastOpenedCupId, this.mainState.browsingCupId);
    },
    onWindowResize() {
      if (this.mainState.pageId !== PageIdEnum.Game)
        return;
      this.$nextTick(() => {
        if (this.world != null)
          this.world.resolutionManager.resizeScreenForGame();
      });
    },
    playClickSound() {
      if (this.world != null)
        this.world.soundPlayer.playSound(SoundFileEnum.Click);
    },
    onSettingsItemChanged(settingsItem, newStorageValue) {
      if (this.world == null)
        return;
      this.world.onSettingsItemChanged(settingsItem, newStorageValue);
    },
    closeCurrentPopup() {
      if (this.popupItems.length === 0)
        return;
      const popupItem = this.popupItems[0];
      if (popupItem.id == null)
        return;
      const closeButton = popupItem.buttons.find((button) => button.text === CLOSE_BUTTON_TEXT);
      if (closeButton != null)
        closeButton.onClick();
      this.onPopupItemClose(popupItem.id);
    },
    onPopupItemClose(popupItemId) {
      const popupItemIndex = this.popupItems.findIndex((popupItem) => popupItem.id === popupItemId);
      if (popupItemIndex === -1)
        return;
      this.popupItems.splice(popupItemIndex, 1);
      if (this.world != null)
        this.world.setIsShowingPopup(false);
    },
    createPopupItem(popupItem) {
      this.popupItemIdCounter += 1;
      popupItem.id = this.popupItemIdCounter;
      this.popupItems.push(popupItem);
      if (this.world != null)
        this.world.setIsShowingPopup(true);
    },
    getLaunchMapListing() {
      const launchMapId = this.$route.query[QueryKeyEnum.MapId];
      if (launchMapId == null)
        return null;
      return MapUtils.getMapListingFromMapId(launchMapId);
    },
    onLoaded() {
      const pageId = this.$route.query[QueryKeyEnum.PageId];
      if (pageId != null) {
        this.changePageId(parseInt(pageId));
        return;
      }
      const launchMapListing = this.getLaunchMapListing();
      if (launchMapListing != null) {
        this.onClickMap(launchMapListing);
        return;
      }
      const launchMapUrl = this.$route.query[QueryKeyEnum.MapUrl];
      if (launchMapUrl != null) {
        this.onClickMap(null, launchMapUrl);
        return;
      }
      if (this.world == null)
        throw new Error("World is null");
      this.world.soundPlayer.playMenuMusic();
      void this.world.popupManager.displayPopups();
    },
    async reloadMainState() {
      var _a;
      const newMainState = await MainStateUtils.getNewMainState(this.mainState);
      const mainStateChange = MainStateUtils.getMainStateChange(this.mainState, newMainState);
      this.mainState = newMainState;
      (_a = this.world) == null ? void 0 : _a.setMainState(this.mainState);
      return mainStateChange;
    },
    onLocationChange() {
      if (history.state.forward == null)
        return;
      window.location.reload();
    }
  },
  async mounted() {
    this.mainState.browsingCupId = await FStorage.getInteger(StorageKeyEnum.LastOpenedCupId) ?? CupIdEnum.Newcomer;
    await this.reloadMainState();
    this.isLoadingMain = false;
    window.addEventListener("resize", () => this.onWindowResize());
    window.addEventListener("locationchange", () => this.onLocationChange());
    setTimeout(() => this.onLoaded(), 200);
    this.$nextTick(() => {
      if (window.bagManager != null)
        window.bagManager.onPageLoaded();
      if (window.sponsorManager != null)
        window.sponsorManager.onPageLoaded();
      this.world = new FSingleWorld(
        this.mainState,
        (popupItem) => this.createPopupItem(popupItem),
        () => this.returnToMenuFromGame(),
        (deltaIndex) => this.changeCupByDeltaIndex(deltaIndex),
        (mapListing) => this.onClickMap(mapListing),
        () => this.reloadMainState(),
        () => this.popupItems.length > 0,
        () => this.closeCurrentPopup()
      );
    });
  },
  components: { VMenu, VGame, VCredits, VSettings, VCups, VFinder, VAchievements, VSkins, VPopupItem }
});
const VSingleplayer_vue_vue_type_style_index_0_scoped_ebd70a9e_lang = "";
const _hoisted_1 = {
  key: 0,
  class: "main"
};
const _hoisted_2 = {
  key: 0,
  class: "popupContainer"
};
const _hoisted_3 = { key: 0 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VPopupItem = resolveComponent("VPopupItem");
  const _component_VGame = resolveComponent("VGame");
  const _component_VMenu = resolveComponent("VMenu");
  const _component_VCredits = resolveComponent("VCredits");
  const _component_VSettings = resolveComponent("VSettings");
  const _component_VCups = resolveComponent("VCups");
  const _component_VFinder = resolveComponent("VFinder");
  const _component_VAchievements = resolveComponent("VAchievements");
  const _component_VSkins = resolveComponent("VSkins");
  return _ctx.isLoadingMain === false ? (openBlock(), createElementBlock("main", _hoisted_1, [
    _ctx.popupItems.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_2, [
      _ctx.popupItems.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_3, [
        createVNode(_component_VPopupItem, {
          popupItem: _ctx.popupItems[0],
          onPlayClickSound: _ctx.playClickSound,
          onOnPopupItemClose: _ctx.onPopupItemClose
        }, null, 8, ["popupItem", "onPlayClickSound", "onOnPopupItemClose"])
      ])) : createCommentVNode("", true)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", {
      class: normalizeClass(["pageContainer", { isVisible: _ctx.mainState.pageId === _ctx.PageIdEnum.Game }])
    }, [
      createVNode(_component_VGame, { mainState: _ctx.mainState }, null, 8, ["mainState"])
    ], 2),
    createBaseVNode("div", {
      class: normalizeClass(["pageContainer", { isVisible: _ctx.mainState.pageId === _ctx.PageIdEnum.Menu }])
    }, [
      createVNode(_component_VMenu, {
        mainState: _ctx.mainState,
        onChangePageId: _ctx.changePageId,
        onOnClickMap: _ctx.onClickMap,
        onCreatePopupItem: _ctx.createPopupItem,
        onChangeCupByDeltaIndex: _ctx.changeCupByDeltaIndex
      }, null, 8, ["mainState", "onChangePageId", "onOnClickMap", "onCreatePopupItem", "onChangeCupByDeltaIndex"])
    ], 2),
    createBaseVNode("div", {
      class: normalizeClass(["pageContainer", { isVisible: _ctx.mainState.pageId === _ctx.PageIdEnum.Credits }])
    }, [
      createVNode(_component_VCredits, { onOnClickMenuButton: _ctx.onClickMenuButton }, null, 8, ["onOnClickMenuButton"])
    ], 2),
    createBaseVNode("div", {
      class: normalizeClass(["pageContainer", { isVisible: _ctx.mainState.pageId === _ctx.PageIdEnum.Settings }])
    }, [
      createVNode(_component_VSettings, {
        onOnClickMenuButton: _ctx.onClickMenuButton,
        mainState: _ctx.mainState,
        onOnSettingsItemChanged: _ctx.onSettingsItemChanged
      }, null, 8, ["onOnClickMenuButton", "mainState", "onOnSettingsItemChanged"])
    ], 2),
    createBaseVNode("div", {
      class: normalizeClass(["pageContainer", { isVisible: _ctx.mainState.pageId === _ctx.PageIdEnum.Cups }])
    }, [
      createVNode(_component_VCups, {
        onOnClickMenuButton: _ctx.onClickMenuButton,
        onGoToCupInMenu: _ctx.goToCupInMenu
      }, null, 8, ["onOnClickMenuButton", "onGoToCupInMenu"])
    ], 2),
    createBaseVNode("div", {
      class: normalizeClass(["pageContainer", { isVisible: _ctx.mainState.pageId === _ctx.PageIdEnum.Finder }])
    }, [
      createVNode(_component_VFinder, {
        onOnClickMap: _ctx.onClickMap,
        mainState: _ctx.mainState,
        onCreatePopupItem: _ctx.createPopupItem,
        onOnClickMenuButton: _ctx.onClickMenuButton
      }, null, 8, ["onOnClickMap", "mainState", "onCreatePopupItem", "onOnClickMenuButton"])
    ], 2),
    createBaseVNode("div", {
      class: normalizeClass(["pageContainer", { isVisible: _ctx.mainState.pageId === _ctx.PageIdEnum.Achievements }])
    }, [
      createVNode(_component_VAchievements, {
        mainState: _ctx.mainState,
        onOnClickMenuButton: _ctx.onClickMenuButton
      }, null, 8, ["mainState", "onOnClickMenuButton"])
    ], 2),
    createBaseVNode("div", {
      class: normalizeClass(["pageContainer", { isVisible: _ctx.mainState.pageId === _ctx.PageIdEnum.Skins }])
    }, [
      createVNode(_component_VSkins, {
        mainState: _ctx.mainState,
        onPlayClickSound: _ctx.playClickSound,
        onCreatePopupItem: _ctx.createPopupItem,
        onChangePageId: _ctx.changePageId,
        onReloadMainState: _ctx.reloadMainState,
        onOnClickMenuButton: _ctx.onClickMenuButton
      }, null, 8, ["mainState", "onPlayClickSound", "onCreatePopupItem", "onChangePageId", "onReloadMainState", "onOnClickMenuButton"])
    ], 2)
  ])) : createCommentVNode("", true);
}
const VSingleplayer = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ebd70a9e"]]);
export {
  VSingleplayer as default
};