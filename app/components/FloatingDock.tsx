

import { IconAddressBook, IconBrandGithub, IconDeviceDesktopCode, IconHome, IconPrompt } from "@tabler/icons-react";
import { AnimatePresence, motion, MotionValue, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

export default function FloatingDock(){
  return(
    <div className="h-screen flex items-center justify-center">
        <FloatingDockCore  />
    </div>
  )
}

  function FloatingDockCore(): any{
  const links=[{
    title:"About",
    icon:(<IconHome className="h-full w-full text-neutral-500 "/>),
  },{
    title:"Skills",
    icon:(<IconPrompt className="h-full w-full text-neutral-500" />),
  },{
    title:"Projects",
    icon:(<IconDeviceDesktopCode className="h-full w-full text-neutral-500" />)
  },{
    title:"Contact",
    icon:(<IconAddressBook className="h-full w-full text-neutral-500" />)
  },{
    title:"GitHub",
    icon:(<IconBrandGithub className="h-full w-full text-neutral-500" />),
  }];
  
  let mouseX=useMotionValue(Infinity);

  return(
  <motion.div className="mx-auto h-16 gap-9 fixed bottom-10 flex items-end border-1 border-neutral-300 rounded-2xl px-4 pb-3 bg-neutral-100"
  onMouseEnter={(e)=> mouseX.set(e.pageX)}
  onMouseLeave={()=> mouseX.set(Infinity)}
  >
    {links.map((link)=>{
      return <IconContainer key={link.title} mouseX={mouseX} title={link.title} icon={link.icon} />
    })}
  </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  icon,
}:{
  mouseX:MotionValue;
  title:string;
  icon:React.ReactNode;
}){

  let ref = useRef<HTMLDivElement>(null);
 // useTransform motion value hi return krta h
  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
 
    return val - bounds.x - bounds.width / 2;
  });
 
  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
 
  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );
 
  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
 
  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered,setHovered]=useState(false);
  
  return(
    <Link href={`#${title}`} >
      <motion.div 
        ref={ref}
        style={{ width, height }}
        className="flex items-center justify-center p-2 border-1 bg-neutral-300 rounded-full border-neutral-400 relative"
        onMouseEnter={()=> setHovered(true)}
        onMouseLeave={()=> setHovered(false)}
        >
          <AnimatePresence>
            {hovered && <motion.div
            initial={{opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="px-2 py-0.5 rounded-md bg-neutral-200 border text-neutral-600 absolute left-1/2 -translate-x-1/2 -top-8 text-xs"
            >
              {title}
            </motion.div>}
          </AnimatePresence>
          <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
      </Link>
  );

}