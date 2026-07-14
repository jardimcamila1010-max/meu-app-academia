import React, { useState } from "react";
import {
  Check,
  LogOut,
  ChevronRight,
  Image as ImageIcon,
  Flame,
  Plus,
  Trash2,
  ArrowLeft,
  Phone,
  Mail,
  Lock,
  User as UserIcon,
} from "lucide-react";

var LOGO_URL = "https://i.postimg.cc/NLQPwFC2/Whats-App-Image-2026-07-14-at-17-04-16.jpg";

var ADMIN_EMAIL = "admin@academia.com";
var ADMIN_PASSWORD = "professor123";

var IMG_SUPINO = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80";
var IMG_COSTAS = "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&q=80";
var IMG_PERNAS = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80";
var IMG_GERAL = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80";

function emptyWorkout() {
  return {
    A: { subtitle: "Treino a definir", exercises: [] },
    B: { subtitle: "Treino a definir", exercises: [] },
    C: { subtitle: "Treino a definir", exercises: [] },
  };
}

var INITIAL_USERS = [
  { id: "s1", name: "Carlos Silva", phone: "(11) 98888-1234", email: "carlos@email.com", password: "123456", role: "aluno" },
  { id: "s2", name: "Fernanda Souza", phone: "(11) 97777-2345", email: "fernanda@email.com", password: "123456", role: "aluno" },
];

var INITIAL_WORKOUTS = {
  s1: {
    A: {
      subtitle: "Peito e Triceps",
      exercises: [
        { id: "s1a1", name: "Supino Reto com Barra", sets: 4, reps: "10-12", image: IMG_SUPINO },
        { id: "s1a2", name: "Triceps Corda", sets: 4, reps: "12-15", image: IMG_GERAL },
      ],
    },
    B: {
      subtitle: "Costas e Biceps",
      exercises: [
        { id: "s1b1", name: "Puxada Frontal", sets: 4, reps: "10-12", image: IMG_COSTAS },
        { id: "s1b2", name: "Rosca Direta com Barra", sets: 4, reps: "10-12", image: IMG_GERAL },
      ],
    },
    C: {
      subtitle: "Pernas e Ombro",
      exercises: [
        { id: "s1c1", name: "Agachamento Livre", sets: 4, reps: "8-10", image: IMG_PERNAS },
        { id: "s1c2", name: "Leg Press 45", sets: 4, reps: "10-12", image: IMG_PERNAS },
      ],
    },
  },
  s2: {
    A: {
      subtitle: "Corpo Todo - Resistencia",
      exercises: [
        { id: "s2a1", name: "Flexao de Braco", sets: 3, reps: "12-15", image: IMG_GERAL },
        { id: "s2a2", name: "Prancha Abdominal", sets: 3, reps: "40s", image: IMG_GERAL },
      ],
    },
    B: {
      subtitle: "Inferiores e Gluteos",
      exercises: [
        { id: "s2b1", name: "Agachamento Bulgaro", sets: 3, reps: "10-12", image: IMG_PERNAS },
        { id: "s2b2", name: "Elevacao Pelvica", sets: 4, reps: "12-15", image: IMG_PERNAS },
      ],
    },
    C: {
      subtitle: "Cardio e Core",
      exercises: [
        { id: "s2c1", name: "Bicicleta Ergometrica", sets: 1, reps: "20 min", image: IMG_GERAL },
        { id: "s2c2", name: "Abdominal Infra", sets: 3, reps: "15-20", image: IMG_GERAL },
      ],
    },
  },
};

var TABS = ["A", "B", "C"];

var C = {
  bg: "#11161d",
  panel: "#171e27",
  panelAlt: "#1e2733",
  border: "#2a3542",
  silverDim: "#8b98a5",
  blue: "#2f86c6",
  blueDim: "#1d5a8c",
  blueDeep: "#123a5c",
  white: "#f3f5f7",
  danger: "#c65a5a",
};

var inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: C.bg,
  border: "1px solid " + C.border,
  borderRadius: 8,
  color: C.white,
  fontSize: 13.5,
  padding: "10px 12px 10px 34px",
  outline: "none",
};

var plainInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: C.bg,
  border: "1px solid " + C.border,
  borderRadius: 8,
  color: C.white,
  fontSize: 13.5,
  padding: "10px 12px",
  outline: "none",
};

function IconField(props) {
  return (
    <div style={{ position: "relative", marginBottom: 10 }}>
      <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.silverDim, display: "flex" }}>
        {props.icon}
      </div>
      <input
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        style={inputStyle}
        required
      />
    </div>
  );
}

function Avatar(props) {
  var size = props.size || 40;
  var parts = props.name.split(" ");
  var initials = ((parts[0] ? parts[0][0] : "") + (parts[1] ? parts[1][0] : "")).toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, " + C.blueDim + ", " + C.blueDeep + ")",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: C.white,
        fontWeight: 700,
        fontSize: size * 0.38,
        border: "1px solid " + C.border,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// Marca oficial da academia. Usa a logo real via LOGO_URL.
function Logo(props) {
  var small = props.small;
  return (
    <div style={{ textAlign: "center", marginBottom: small ? 20 : 30 }}>
      <img
        src={LOGO_URL}
        alt="Phisic Form"
        style={{
          width: small ? 64 : 84,
          height: small ? 64 : 84,
          margin: "0 auto 12px",
          borderRadius: 16,
          objectFit: "cover",
          border: "1px solid " + C.border,
          display: "block",
        }}
      />
      <h1 style={{ color: C.white, fontSize: small ? 20 : 24, fontWeight: 800, letterSpacing: 1, margin: 0, textTransform: "uppercase" }}>
        Phisic Form
      </h1>
      <div style={{ width: 54, height: 3, background: C.blue, margin: "9px auto 0", borderRadius: 2 }} />
    </div>
  );
}

// Barra de marca compacta usada no topo dos paineis (aluno e professor).
function TopBrandBar() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px 0" }}>
      <img
        src={LOGO_URL}
        alt="Phisic Form"
        style={{ width: 24, height: 24, borderRadius: 6, objectFit: "cover", border: "1px solid " + C.border }}
      />
      <span style={{ color: C.silverDim, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
        Phisic Form
      </span>
    </div>
  );
}

function Shell(props) {
  return (
    <div style={{ minHeight: 600, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      {props.children}
    </div>
  );
}

function BackButton(props) {
  return (
    <button onClick={props.onClick} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: C.silverDim, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>
      <ArrowLeft size={15} /> Voltar
    </button>
  );
}

function WelcomeScreen(props) {
  return (
    <Shell>
      <Logo />
      <p style={{ color: C.silverDim, fontSize: 13, marginBottom: 26, marginTop: -14, textAlign: "center" }}>
        Sua evolucao comeca aqui.
      </p>
      <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={props.onGoLogin} style={{ background: C.blue, border: "none", borderRadius: 10, color: C.white, fontSize: 14.5, fontWeight: 700, padding: "13px 0", cursor: "pointer" }}>
          Entrar
        </button>
        <button onClick={props.onGoSignup} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 10, color: C.white, fontSize: 14.5, fontWeight: 700, padding: "13px 0", cursor: "pointer" }}>
          Criar conta
        </button>
      </div>
    </Shell>
  );
}

function LoginScreen(props) {
  var users = props.users;
  var stateEmail = useState("");
  var email = stateEmail[0];
  var setEmail = stateEmail[1];
  var statePassword = useState("");
  var password = statePassword[0];
  var setPassword = statePassword[1];
  var stateError = useState("");
  var error = stateError[0];
  var setError = stateError[1];

  function submit(e) {
    e.preventDefault();
    var cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setError("");
      props.onLoginSuccess({ role: "professor" });
      return;
    }

    var match = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === cleanEmail && users[i].password === password) {
        match = users[i];
        break;
      }
    }

    if (match) {
      setError("");
      props.onLoginSuccess({ role: "aluno", user: match });
    } else {
      setError("E-mail ou senha incorretos.");
    }
  }

  return (
    <Shell>
      <BackButton onClick={props.onBack} />
      <Logo small />
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 340 }}>
        <IconField icon={<Mail size={16} />} type="email" placeholder="E-mail" value={email} onChange={function (e) { setEmail(e.target.value); }} />
        <IconField icon={<Lock size={16} />} type="password" placeholder="Senha" value={password} onChange={function (e) { setPassword(e.target.value); }} />

        {error ? <p style={{ color: C.danger, fontSize: 12.5, margin: "0 0 10px" }}>{error}</p> : null}

        <button type="submit" style={{ width: "100%", background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 14, fontWeight: 700, padding: "12px 0", cursor: "pointer", marginTop: 4 }}>
          Entrar
        </button>
      </form>
      <p style={{ color: C.silverDim, fontSize: 12.5, marginTop: 18 }}>
        Nao tem conta?{" "}
        <span onClick={props.onGoSignup} style={{ color: C.blue, fontWeight: 700, cursor: "pointer" }}>
          Criar conta
        </span>
      </p>
    </Shell>
  );
}

function SignupScreen(props) {
  var users = props.users;
  var stateName = useState("");
  var name = stateName[0];
  var setName = stateName[1];
  var statePhone = useState("");
  var phone = statePhone[0];
  var setPhone = statePhone[1];
  var stateEmail = useState("");
  var email = stateEmail[0];
  var setEmail = stateEmail[1];
  var statePassword = useState("");
  var password = statePassword[0];
  var setPassword = statePassword[1];
  var stateError = useState("");
  var error = stateError[0];
  var setError = stateError[1];

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    var cleanEmail = email.trim().toLowerCase();
    var taken = cleanEmail === ADMIN_EMAIL;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === cleanEmail) taken = true;
    }
    if (taken) {
      setError("Ja existe uma conta com este e-mail.");
      return;
    }

    var newUser = {
      id: "s" + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      password: password,
      role: "aluno",
    };
    props.onSignupSuccess(newUser);
  }

  return (
    <Shell>
      <BackButton onClick={props.onBack} />
      <Logo small />
      <p style={{ color: C.silverDim, fontSize: 13, marginBottom: 18, marginTop: -8 }}>Criar sua conta de aluno</p>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 340 }}>
        <IconField icon={<UserIcon size={16} />} type="text" placeholder="Nome completo" value={name} onChange={function (e) { setName(e.target.value); }} />
        <IconField icon={<Phone size={16} />} type="tel" placeholder="Telefone" value={phone} onChange={function (e) { setPhone(e.target.value); }} />
        <IconField icon={<Mail size={16} />} type="email" placeholder="E-mail" value={email} onChange={function (e) { setEmail(e.target.value); }} />
        <IconField icon={<Lock size={16} />} type="password" placeholder="Senha" value={password} onChange={function (e) { setPassword(e.target.value); }} />

        {error ? <p style={{ color: C.danger, fontSize: 12.5, margin: "0 0 10px" }}>{error}</p> : null}

        <button type="submit" style={{ width: "100%", background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 14, fontWeight: 700, padding: "12px 0", cursor: "pointer", marginTop: 4 }}>
          Criar conta
        </button>
      </form>
    </Shell>
  );
}

function StudentPicker(props) {
  var students = props.students;
  return (
    <Shell>
      <BackButton onClick={props.onBack} />
      <Logo small />
      <p style={{ color: C.silverDim, fontSize: 13, marginBottom: 20, marginTop: -8 }}>{props.title}</p>
      <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 }}>
        {students.length === 0 ? (
          <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center" }}>Nenhum aluno cadastrado ainda.</p>
        ) : null}
        {students.map(function (s) {
          return (
            <button
              key={s.id}
              onClick={function () { props.onPick(s); }}
              style={{ display: "flex", alignItems: "center", gap: 12, background: C.panel, border: "1px solid " + C.border, borderRadius: 12, padding: "12px 14px", cursor: "pointer", textAlign: "left" }}
            >
              <Avatar name={s.name} />
              <span style={{ color: C.white, fontSize: 15, fontWeight: 600, flex: 1 }}>{s.name}</span>
              <ChevronRight size={18} color={C.silverDim} />
            </button>
          );
        })}
      </div>
    </Shell>
  );
}

function ProgressBar(props) {
  var done = props.done;
  var total = props.total;
  var pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: C.silverDim, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Progresso de hoje</span>
        <span style={{ color: C.blue, fontSize: 13, fontWeight: 700 }}>{done}/{total} - {pct}%</span>
      </div>
      <div style={{ width: "100%", height: 8, background: C.panelAlt, borderRadius: 6, overflow: "hidden", border: "1px solid " + C.border }}>
        <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg, " + C.blueDim + ", " + C.blue + ")", borderRadius: 6, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

function ExerciseCard(props) {
  var ex = props.ex;
  var stateImgError = useState(false);
  var imgError = stateImgError[0];
  var setImgError = stateImgError[1];

  return (
    <div
      style={{
        background: props.checked ? "rgba(47,134,198,0.08)" : C.panel,
        border: "1px solid " + (props.checked ? C.blueDim : C.border),
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", height: 160, background: C.panelAlt }}>
        {ex.image && !imgError ? (
          <img
            src={ex.image}
            alt={ex.name}
            onError={function () { setImgError(true); }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={32} color={C.silverDim} />
          </div>
        )}
      </div>

      <div style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: C.white, fontSize: 14, fontWeight: 700, margin: "0 0 4px", textDecoration: props.checked ? "line-through" : "none", opacity: props.checked ? 0.6 : 1 }}>
            {ex.name}
          </p>
          <p style={{ color: C.silverDim, fontSize: 12.5, margin: "0 0 8px" }}>{ex.sets} series x {ex.reps} reps</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ color: C.silverDim, fontSize: 12 }}>Carga</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={props.weight === undefined ? "" : props.weight}
              onChange={function (e) { props.onWeightChange(ex.id, e.target.value); }}
              style={{ width: 56, background: C.bg, border: "1px solid " + C.border, borderRadius: 6, color: C.white, fontSize: 13, padding: "4px 6px", outline: "none" }}
            />
            <span style={{ color: C.silverDim, fontSize: 12 }}>kg</span>
          </div>
        </div>

        <button
          onClick={function () { props.onToggle(ex.id); }}
          aria-label="Marcar exercicio"
          style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid " + (props.checked ? C.blue : C.border), background: props.checked ? C.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <Check size={18} color={props.checked ? C.white : C.silverDim} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function AlunoDashboard(props) {
  var student = props.student;
  var stateTab = useState("A");
  var tab = stateTab[0];
  var setTab = stateTab[1];
  var stateChecked = useState({});
  var checkedMap = stateChecked[0];
  var setCheckedMap = stateChecked[1];
  var stateWeights = useState({});
  var weights = stateWeights[0];
  var setWeights = stateWeights[1];

  var myWorkout = props.workoutsByStudent[student.id] || emptyWorkout();

  function toggle(exId) {
    var key = student.id + "-" + tab + "-" + exId;
    setCheckedMap(function (prev) {
      var next = Object.assign({}, prev);
      next[key] = !next[key];
      return next;
    });
  }
  function setWeight(exId, val) {
    var key = student.id + "-" + tab + "-" + exId;
    setWeights(function (prev) {
      var next = Object.assign({}, prev);
      next[key] = val;
      return next;
    });
  }

  var list = myWorkout[tab].exercises;
  var doneCount = 0;
  for (var i = 0; i < list.length; i++) {
    if (checkedMap[student.id + "-" + tab + "-" + list[i].id]) doneCount++;
  }

  return (
    <div style={{ minHeight: 600, background: C.bg, fontFamily: "system-ui, sans-serif", paddingBottom: 30 }}>
      <TopBrandBar />
      <div style={{ padding: "12px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={student.name} size={38} />
          <div>
            <p style={{ color: C.white, fontSize: 15, fontWeight: 800, margin: 0 }}>
              Treino de {student.name.split(" ")[0]}
            </p>
            <p style={{ color: C.silverDim, fontSize: 11.5, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
              <Phone size={11} /> {student.phone}
            </p>
          </div>
        </div>
        <button
          onClick={props.onExit}
          aria-label="Sair"
          style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid " + C.border, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <LogOut size={16} color={C.silverDim} />
        </button>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", gap: 8 }}>
        {TABS.map(function (k) {
          var active = k === tab;
          return (
            <button
              key={k}
              onClick={function () { setTab(k); }}
              style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "1px solid " + (active ? C.blue : C.border), background: active ? C.blueDeep : C.panel, color: active ? C.white : C.silverDim, fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              Treino {k}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Flame size={16} color={C.blue} />
          <h2 style={{ color: C.white, fontSize: 16, fontWeight: 800, margin: 0 }}>{myWorkout[tab].subtitle}</h2>
        </div>

        <ProgressBar done={doneCount} total={list.length} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.length === 0 ? (
            <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              Nenhum exercicio cadastrado neste treino ainda.
            </p>
          ) : null}
          {list.map(function (ex) {
            return (
              <ExerciseCard
                key={ex.id}
                ex={ex}
                checked={!!checkedMap[student.id + "-" + tab + "-" + ex.id]}
                weight={weights[student.id + "-" + tab + "-" + ex.id]}
                onToggle={toggle}
                onWeightChange={setWeight}
              />
            );
          })}
        </div>

        {list.length > 0 && doneCount === list.length ? (
          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(47,134,198,0.12)", border: "1px solid " + C.blueDim, color: C.white, fontSize: 13, fontWeight: 700, textAlign: "center" }}>
            Treino {tab} concluido. Bom trabalho!
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProfessorPanel(props) {
  var stateTab = useState("A");
  var tab = stateTab[0];
  var setTab = stateTab[1];
  var stateName = useState("");
  var newName = stateName[0];
  var setNewName = stateName[1];
  var stateSets = useState("3");
  var newSets = stateSets[0];
  var setNewSets = stateSets[1];
  var stateReps = useState("10-12");
  var newReps = stateReps[0];
  var setNewReps = stateReps[1];
  var stateImage = useState("");
  var newImage = stateImage[0];
  var setNewImage = stateImage[1];

  var students = [];
  for (var i = 0; i < props.users.length; i++) {
    if (props.users[i].role === "aluno") students.push(props.users[i]);
  }

  var selectedStudent = props.selectedStudent;

  if (!selectedStudent) {
    return <StudentPicker title="Selecione o aluno para editar o treino" onPick={props.onChangeStudent} onBack={props.onExit} students={students} />;
  }

  var workout = props.workoutsByStudent[selectedStudent.id] || emptyWorkout();
  var list = workout[tab].exercises;

  function addExercise() {
    if (!newName.trim()) return;
    var newEx = {
      id: selectedStudent.id + "-" + tab + "-" + Date.now(),
      name: newName.trim(),
      sets: Number(newSets) || 1,
      reps: newReps.trim() || "-",
      image: newImage.trim() || IMG_GERAL,
    };
    props.onUpdateWorkout(selectedStudent.id, tab, list.concat([newEx]));
    setNewName("");
    setNewSets("3");
    setNewReps("10-12");
    setNewImage("");
  }

  function deleteExercise(exId) {
    props.onUpdateWorkout(selectedStudent.id, tab, list.filter(function (e) { return e.id !== exId; }));
  }

  return (
    <div style={{ minHeight: 600, background: C.bg, fontFamily: "system-ui, sans-serif", paddingBottom: 30 }}>
      <TopBrandBar />
      <div style={{ padding: "12px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={function () { props.onChangeStudent(null); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: C.silverDim, fontSize: 12.5, cursor: "pointer" }}>
          <ArrowLeft size={14} /> Trocar aluno
        </button>
        <button onClick={props.onExit} aria-label="Sair" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid " + C.border, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <LogOut size={16} color={C.silverDim} />
        </button>
      </div>

      <div style={{ padding: "12px 18px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={selectedStudent.name} size={38} />
        <div>
          <p style={{ color: C.white, fontSize: 15, fontWeight: 800, margin: 0 }}>Treino de {selectedStudent.name.split(" ")[0]}</p>
          <p style={{ color: C.silverDim, fontSize: 11.5, margin: 0 }}>Painel do professor - {selectedStudent.phone}</p>
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", gap: 8 }}>
        {TABS.map(function (k) {
          var active = k === tab;
          return (
            <button
              key={k}
              onClick={function () { setTab(k); }}
              style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "1px solid " + (active ? C.blue : C.border), background: active ? C.blueDeep : C.panel, color: active ? C.white : C.silverDim, fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              Treino {k}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        <p style={{ color: C.silverDim, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>{workout[tab].subtitle}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {list.length === 0 ? (
            <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center", padding: "12px 0" }}>Nenhum exercicio neste treino. Adicione um abaixo.</p>
          ) : null}
          {list.map(function (ex) {
            return (
              <div key={ex.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.panel, border: "1px solid " + C.border, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: C.panelAlt }}>
                  <img src={ex.image || IMG_GERAL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: C.white, fontSize: 13.5, fontWeight: 700, margin: 0 }}>{ex.name}</p>
                  <p style={{ color: C.silverDim, fontSize: 12, margin: 0 }}>{ex.sets} series x {ex.reps} reps</p>
                </div>
                <button
                  onClick={function () { deleteExercise(ex.id); }}
                  aria-label="Excluir exercicio"
                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid " + C.border, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <Trash2 size={15} color={C.danger} />
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ background: C.panelAlt, border: "1px solid " + C.border, borderRadius: 12, padding: 12 }}>
          <p style={{ color: C.silverDim, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Adicionar exercicio</p>
          <input type="text" placeholder="Nome do exercicio" value={newName} onChange={function (e) { setNewName(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input type="number" placeholder="Series" value={newSets} onChange={function (e) { setNewSets(e.target.value); }} style={Object.assign({}, plainInputStyle, { width: 70 })} />
            <input type="text" placeholder="Repeticoes (ex: 10-12)" value={newReps} onChange={function (e) { setNewReps(e.target.value); }} style={Object.assign({}, plainInputStyle, { flex: 1 })} />
          </div>
          <input type="text" placeholder="URL da imagem/GIF (opcional)" value={newImage} onChange={function (e) { setNewImage(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 10 })} />
          <button
            onClick={addExercise}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 13, fontWeight: 700, padding: "10px 0", cursor: "pointer" }}
          >
            <Plus size={15} /> Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  var stateScreen = useState("welcome");
  var screen = stateScreen[0];
  var setScreen = stateScreen[1];

  var stateUsers = useState(INITIAL_USERS);
  var users = stateUsers[0];
  var setUsers = stateUsers[1];

  var stateWorkouts = useState(INITIAL_WORKOUTS);
  var workoutsByStudent = stateWorkouts[0];
  var setWorkoutsByStudent = stateWorkouts[1];

  var stateRole = useState(null);
  var currentRole = stateRole[0];
  var setCurrentRole = stateRole[1];

  var stateLoggedStudent = useState(null);
  var loggedStudent = stateLoggedStudent[0];
  var setLoggedStudent = stateLoggedStudent[1];

  var stateTeacherStudent = useState(null);
  var teacherStudent = stateTeacherStudent[0];
  var setTeacherStudent = stateTeacherStudent[1];

  function updateWorkout(studentId, tab, newExerciseList) {
    setWorkoutsByStudent(function (prev) {
      var next = Object.assign({}, prev);
      var current = next[studentId] || emptyWorkout();
      var updatedTab = Object.assign({}, current[tab], { exercises: newExerciseList });
      next[studentId] = Object.assign({}, current);
      next[studentId][tab] = updatedTab;
      return next;
    });
  }

  function handleLoginSuccess(result) {
    setCurrentRole(result.role);
    if (result.role === "aluno") {
      setLoggedStudent(result.user);
    }
    setScreen("app");
  }

  function handleSignupSuccess(newUser) {
    setUsers(function (prev) { return prev.concat([newUser]); });
    setWorkoutsByStudent(function (prev) {
      var next = Object.assign({}, prev);
      next[newUser.id] = emptyWorkout();
      return next;
    });
    setCurrentRole("aluno");
    setLoggedStudent(newUser);
    setScreen("app");
  }

  function logout() {
    setCurrentRole(null);
    setLoggedStudent(null);
    setTeacherStudent(null);
    setScreen("welcome");
  }

  var content = null;

  if (screen === "welcome") {
    content = <WelcomeScreen onGoLogin={function () { setScreen("login"); }} onGoSignup={function () { setScreen("signup"); }} />;
  } else if (screen === "login") {
    content = <LoginScreen onBack={function () { setScreen("welcome"); }} onLoginSuccess={handleLoginSuccess} onGoSignup={function () { setScreen("signup"); }} users={users} />;
  } else if (screen === "signup") {
    content = <SignupScreen onBack={function () { setScreen("welcome"); }} onSignupSuccess={handleSignupSuccess} users={users} />;
  } else if (currentRole === "aluno") {
    content = <AlunoDashboard student={loggedStudent} workoutsByStudent={workoutsByStudent} onExit={logout} />;
  } else {
    content = (
      <ProfessorPanel
        selectedStudent={teacherStudent}
        users={users}
        workoutsByStudent={workoutsByStudent}
        onUpdateWorkout={updateWorkout}
        onChangeStudent={setTeacherStudent}
        onExit={logout}
      />
    );
  }

  return <div style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}>{content}</div>;
}
