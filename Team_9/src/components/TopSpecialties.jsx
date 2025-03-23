import { FiHeart, FiScissors, FiUsers, FiSun, FiActivity, FiEye } from 'react-icons/fi';
import { SpecialtyCard } from './SpecialtyCard';
import Health from '../assets/good-health.png';
import Tooth from '../assets/broken-tooth.png';
import Eye from '../assets/eye-test.png';
import Skin from '../assets/dermatology.png';
import Mental from '../assets/mental-health.png';
import Pelvic from '../assets/pelvic-exam.png';

const specialties = [
  { name: 'Primary Care', icon: HeartIcon },
  { name: 'Dentist', icon: DentistIcon },
  { name: 'Gynologist', icon: PelvicIcon },
  { name: 'Dermatologist', icon: SkinIcon },
  { name: 'Psychiatrist', icon: MentalIcon },
  { name: 'Eye Doctor', icon: EyeIcon },
];

function HeartIcon() {
  return (
    <img src={Health}/>
  );
}

function DentistIcon() {
  return (
    <img src={Tooth}/>
  );
}

function EyeIcon() {
  return (
    <img src={Eye}/>
  );
}

function SkinIcon() {
  return (
    <img src ={Skin}/>
  );
}

function MentalIcon() {
  return (
    <img src={Mental}/>
  );
}

function PelvicIcon() {
  return (
    <img src={Pelvic}/>
  );
}


export function TopSpecialties() {
  return (
    <div className="mt-12">
      <h2 className="text-3xl  text-gray-800 mb-6">Top-Searched Specialties</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {specialties.map((specialty) => (
          <SpecialtyCard
            key={specialty.name}
            icon={specialty.icon}
            name={specialty.name}
          />
        ))}
      </div>
    </div>
  );
}