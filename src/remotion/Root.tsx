import { Composition } from "remotion";
import { HeroBackground } from "./compositions/HeroBackground";
import {
  HeroIntro,
  HERO_INTRO_DURATION,
  HERO_INTRO_HEIGHT,
  HERO_INTRO_WIDTH,
} from "./compositions/HeroIntro";

/**
 * Remotion 合成注册表
 */
export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="HeroBackground"
        component={HeroBackground}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HeroIntro"
        component={HeroIntro}
        durationInFrames={HERO_INTRO_DURATION}
        fps={30}
        width={HERO_INTRO_WIDTH}
        height={HERO_INTRO_HEIGHT}
        defaultProps={{
          title: "全栈开发者 · 技术写作者",
          name: "Awei",
          bio: "热爱用代码构建优雅的产品体验。",
        }}
      />
    </>
  );
};
