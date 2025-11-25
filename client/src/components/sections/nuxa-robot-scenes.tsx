import nuxaRobotForest from "@assets/generated_images/nuxa_robot_in_forest_setting.png";
import nuxaRobotBeach from "@assets/generated_images/nuxa_robot_on_sunset_beach.png";
import nuxaRobotZen from "@assets/generated_images/nuxa_robot_in_zen_garden.png";
import nuxaRobotMountain from "@assets/generated_images/nuxa_robot_on_mountain_top.png";
import nuxaRobotMeadow from "@assets/generated_images/nuxa_robot_in_flower_meadow.png";

export function NuxaRobotForestSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        <img 
          src={nuxaRobotForest} 
          alt="Robot NUXA conversando en un bosque tranquilo" 
          className="w-full h-auto object-cover"
          data-testid="img-nuxa-robot-forest"
        />
      </div>
    </section>
  );
}

export function NuxaRobotBeachSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        <img 
          src={nuxaRobotBeach} 
          alt="Robot NUXA conversando en una playa al atardecer" 
          className="w-full h-auto object-cover"
          data-testid="img-nuxa-robot-beach"
        />
      </div>
    </section>
  );
}

export function NuxaRobotZenSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        <img 
          src={nuxaRobotZen} 
          alt="Robot NUXA conversando en un jardín zen japonés" 
          className="w-full h-auto object-cover"
          data-testid="img-nuxa-robot-zen"
        />
      </div>
    </section>
  );
}

export function NuxaRobotMountainSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        <img 
          src={nuxaRobotMountain} 
          alt="Robot NUXA conversando en la cima de una montaña" 
          className="w-full h-auto object-cover"
          data-testid="img-nuxa-robot-mountain"
        />
      </div>
    </section>
  );
}

export function NuxaRobotMeadowSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        <img 
          src={nuxaRobotMeadow} 
          alt="Robot NUXA conversando en un prado de flores" 
          className="w-full h-auto object-cover"
          data-testid="img-nuxa-robot-meadow"
        />
      </div>
    </section>
  );
}
