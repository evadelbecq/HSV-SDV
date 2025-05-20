import sequelize from '../db.js';
import bcrypt from 'bcrypt';

import User from './User.js';
import Patient from './Patient.js';
import Doctor from './Doctor.js';
import Appointment from './Appointment.js';
import Specialization from './Specialization.js';
import Reason from './Reason.js';

// Define all associations after all models are loaded
User.hasOne(Patient, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
  as: 'patient'
});

User.hasOne(Doctor, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
  as: 'doctor'
});

Patient.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'user'
});

Patient.hasMany(Appointment, {
  foreignKey: 'patient_id',
  sourceKey: 'patient_id',
  as: 'appointments'
});

Doctor.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'user'
});

Doctor.hasMany(Appointment, {
  foreignKey: 'doctor_id',
  sourceKey: 'doctor_id',
  as: 'appointments'
});

Doctor.hasOne(Specialization, {
  foreignKey: 'specialization_id',
  sourceKey: 'specialization_id',
  as: 'specialization'
});

Appointment.belongsTo(Patient, {
  foreignKey: 'patient_id',
  targetKey: 'patient_id',
  as: 'patient'
});

Appointment.belongsTo(Doctor, {
  foreignKey: 'doctor_id',
  targetKey: 'doctor_id',
  as: 'doctor'
});

Reason.belongsTo(Specialization, {
  foreignKey: 'specialization_id',
  targetKey: 'specialization_id',
  as: 'specialization'
});

Specialization.hasMany(Reason, {
  foreignKey: 'specialization_id',
  sourceKey: 'specialization_id',
  as: 'reasons'
});
Specialization.hasMany(Doctor, {
  foreignKey: 'specialization_id',
  sourceKey: 'specialization_id',
  as: 'doctors'
});



const initDB = async () => {
  try {
    // Force = true supprime et recrée les tables (utile en dev)
    await sequelize.sync();
    console.log("Base de données synchronisée (tables recréées).");
    
    // Seed specializations
    const specializations = [
      "Cancérologue – Oncologue – Hématologue",
      "Cardiologue",
      "Dermatologue",
      "Endocrinologue – Diabétologue",
      "Hépatologue – Gastroentérologue",
      "Néphrologue – Spécialiste en hémodialyse",
      "Neurologue",
      "Ophtalmologue",
      "Pneumologue",
      "Radiothérapeute",
      "Rhumatologue"
    ];
    
    // Check which specializations already exist
    const existingSpecializations = await Specialization.findAll();
    const existingNames = existingSpecializations.map(spec => spec.name);
    
    // Only insert specializations that don't already exist
    const newSpecializations = specializations
      .filter(name => !existingNames.includes(name))
      .map(name => ({ name }));
    
    if (newSpecializations.length > 0) {
      await Specialization.bulkCreate(newSpecializations);
      console.log(`${newSpecializations.length} specializations added to database.`);
    } else {
      console.log("All specializations already exist in database.");
    }
    
    // Get all specializations with their IDs
    const allSpecializations = await Specialization.findAll();
    
    // Map of reasons by specialization
    const reasonsBySpecialization = {
      "Cancérologue – Oncologue – Hématologue": [
        "Suivi de chimiothérapie ou d'immunothérapie",
        "Diagnostic ou surveillance d'un cancer (sein, poumon, prostate, etc.)",
        "Bilan d'hémopathies (leucémie, lymphome)"
      ],
      "Cardiologue": [
        "Douleurs thoraciques ou palpitations",
        "Hypertension artérielle",
        "Suivi post-infarctus ou d'insuffisance cardiaque"
      ],
      "Dermatologue": [
        "Acné ou eczéma",
        "Surveillance de grains de beauté de mélanome",
        "Infections cutanées (mycoses, verrues)"
      ],
      "Endocrinologue – Diabétologue": [
        "Suivi du diabète (type 1 ou 2)",
        "Troubles thyroïdiens (hypo/hyperthyroïdie)",
        "Bilan d'obésité ou de troubles hormonaux"
      ],
      "Hépatologue – Gastroentérologue": [
        "Douleurs abdominales chroniques",
        "Maladies du foie (hépatite, stéatose)",
        "Troubles digestifs (reflux, colopathie fonctionnelle)"
      ],
      "Néphrologue – Spécialiste en hémodialyse": [
        "Insuffisance rénale chronique",
        "Suivi de dialyse",
        "Troubles électrolytiques (potassium, sodium)"
      ],
      "Neurologue": [
        "Céphalées chroniques ou migraines",
        "Épilepsie ou crises convulsives",
        "Troubles de la mémoire ou suspicion d'Alzheimer"
      ],
      "Ophtalmologue": [
        "Baisse de vision ou myopie",
        "Glaucome ou DMLA",
        "Conjonctivite ou sécheresse oculaire"
      ],
      "Pneumologue": [
        "Asthme ou BPCO",
        "Apnée du sommeil",
        "Infections respiratoires chroniques (bronchite, toux persistante)"
      ],
      "Radiothérapeute": [
        "Planification de séances de radiothérapie",
        "Suivi des effets secondaires du traitement",
        "Surveillance post-traitement oncologique"
      ],
      "Rhumatologue": [
        "Arthrose ou polyarthrite rhumatoïde",
        "Lombalgies ou douleurs articulaires chroniques",
        "Ostéoporose"
      ]
    };
    
    // Create an array to store all reasons
    const reasonsToCreate = [];
    
    // For each specialization, prepare reasons
    for (const specialization of allSpecializations) {
      const reasons = reasonsBySpecialization[specialization.name] || [];
      
      if (reasons.length > 0) {
        // Check which reasons already exist
        const existingReasons = await Reason.findAll({
          where: { specialization_id: specialization.specialization_id }
        });
        const existingLabels = existingReasons.map(r => r.label);
        
        // Add only new reasons
        for (const label of reasons) {
          if (!existingLabels.includes(label)) {
            reasonsToCreate.push({
              specialization_id: specialization.specialization_id,
              label
            });
          }
        }
      }
    }
    
    // Bulk create all new reasons
    if (reasonsToCreate.length > 0) {
      await Reason.bulkCreate(reasonsToCreate);
      console.log(`${reasonsToCreate.length} reasons added to database.`);
    } else {
      console.log("All reasons already exist in database.");
    }
    
    // Seed doctors
    const defaultPassword = await bcrypt.hash("password123", 10); // Default password for all doctors

    const doctorsData = [
      {
        first_name: "Jean",
        last_name: "Bon",
        email: "jean.bon@mediparis.fr",
        phone: "0611223344",
        specialization: "Cancérologue – Oncologue – Hématologue"
      },
      {
        first_name: "Claire",
        last_name: "Voyant",
        email: "claire.voyant@cardioexpert.fr",
        phone: "0722334455",
        specialization: "Cardiologue"
      },
      {
        first_name: "Anne",
        last_name: "Térieur",
        email: "a.terieur@dermoplus.fr",
        phone: "0633445566",
        specialization: "Dermatologue"
      },
      {
        first_name: "Ella",
        last_name: "Boration",
        email: "ella.boration@endodiab.fr",
        phone: "0744556677",
        specialization: "Endocrinologue – Diabétologue"
      },
      {
        first_name: "Ali",
        last_name: "Mentation",
        email: "ali.mentation@gastrocentre.fr",
        phone: "0655667788",
        specialization: "Hépatologue – Gastroentérologue"
      },
      {
        first_name: "Emma",
        last_name: "Glomérule",
        email: "emma.glomerule@nephrocare.fr",
        phone: "0766778899",
        specialization: "Néphrologue – Spécialiste en hémodialyse"
      },
      {
        first_name: "Luc",
        last_name: "Ide",
        email: "luc.ide@neuroclinique.fr",
        phone: "0677889900",
        specialization: "Neurologue"
      },
      {
        first_name: "Iris",
        last_name: "Copie",
        email: "iris.copie@visionplus.fr",
        phone: "0788990011",
        specialization: "Ophtalmologue"
      },
      {
        first_name: "Phil",
        last_name: "Dair",
        email: "phil.dair@respi-med.fr",
        phone: "0699001122",
        specialization: "Pneumologue"
      },
      {
        first_name: "Ray",
        last_name: "Dation",
        email: "ray.dation@radiocare.fr",
        phone: "0700112233",
        specialization: "Radiothérapeute"
      },
      {
        first_name: "Artie",
        last_name: "Culation",
        email: "artie.culation@rhumaplus.fr",
        phone: "0612345678",
        specialization: "Rhumatologue"
      }
    ];

    // Create a specialization map for easier lookup
    const specializationMap = {};
    allSpecializations.forEach(spec => {
      specializationMap[spec.name] = spec.specialization_id;
    });

    // Check which doctors (by email) already exist
    const existingUsers = await User.findAll({
      where: {
        email: doctorsData.map(d => d.email)
      }
    });
    const existingEmails = existingUsers.map(u => u.email);

    // Add only new doctors
    let doctorsAdded = 0;
    for (const doctorData of doctorsData) {
      if (!existingEmails.includes(doctorData.email)) {
        // Create User
        const user = await User.create({
          first_name: doctorData.first_name,
          last_name: doctorData.last_name,
          email: doctorData.email,
          phone: doctorData.phone,
          password: defaultPassword
        });
        
        // Create Doctor with specialization
        await Doctor.create({
          user_id: user.user_id,
          specialization_id: specializationMap[doctorData.specialization]
        });
        
        doctorsAdded++;
      }
    }

    if (doctorsAdded > 0) {
      console.log(`${doctorsAdded} doctors added to database.`);
    } else {
      console.log("All doctors already exist in database.");
    }
    
  } catch (error) {
    console.error("Erreur de synchronisation :", error);
  }
};

export { User, Patient, Doctor, Appointment, Specialization, Reason };

initDB();