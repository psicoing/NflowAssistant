import nuxaRobotForest from "@assets/generated_images/nuxa_robot_in_forest_setting.png";

export default function NuxaRobotHeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full">
        <img 
          src={nuxaRobotForest} 
          alt="Robot NUXA conversando en un bosque tranquilo" 
          className="w-full h-auto object-cover"
          data-testid="img-nuxa-robot-hero"
        />
      </div>
    </section>
  );
}
