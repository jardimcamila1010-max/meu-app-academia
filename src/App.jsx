import React, { useState, useEffect } from "react";
import {
  Check,
  LogOut,
  ChevronRight,
  Image as ImageIcon,
  Flame,
  Plus,
  Trash2,
  Pencil,
  X,
  ArrowLeft,
  Phone,
  Mail,
  Lock,
  User as UserIcon,
  PartyPopper,
} from "lucide-react";
import { supabase } from "./supabaseClient.js";

var LOGO_URL = "https://i.postimg.cc/NLQPwFC2/Whats-App-Image-2026-07-14-at-17-04-16.jpg";
var IMG_GERAL = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80";
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

function groupByTab(rows) {
  var grouped = { A: [], B: [], C: [] };
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (grouped[row.workout_tab]) grouped[row.workout_tab].push(row);
  }
  return grouped;
}

// Formata um timestamp ISO para "dd/mm HH:MM" e diz se e hoje.
function formatHistoryDate(isoString) {
  var d = new Date(isoString);
  var now = new Date();
  var isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  var dd = String(d.getDate()).padStart(2, "0");
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var hh = String(d.getHours()).padStart(2, "0");
  var min = String(d.getMinutes()).padStart(2, "0");

  return { isToday: isToday, label: dd + "/" + mm + " " + hh + ":" + min };
}

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
  var parts = (props.name || "").split(" ");
  var initials = ((parts[0] ? parts[0][0] : "") + (parts[1] ? parts[1][0] : "")).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg, " + C.blueDim + ", " + C.blueDeep + ")",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.white, fontWeight: 700, fontSize: size * 0.38,
        border: "1px solid " + C.border, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function Logo(props) {
  var small = props.small;
  return (
    <div style={{ textAlign: "center", marginBottom: small ? 20 : 30 }}>
      <img
        src={LOGO_URL}
        alt="Phisic Form"
        style={{ width: small ? 64 : 84, height: small ? 64 : 84, margin: "0 auto 12px", borderRadius: 16, objectFit: "cover", border: "1px solid " + C.border, display: "block" }}
      />
      <h1 style={{ color: C.white, fontSize: small ? 20 : 24, fontWeight: 800, letterSpacing: 1, margin: 0, textTransform: "uppercase" }}>
        Phisic Form
      </h1>
      <div style={{ width: 54, height: 3, background: C.blue, margin: "9px auto 0", borderRadius: 2 }} />
    </div>
  );
}

function TopBrandBar() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10 }}>
      <img src={LOGO_URL} alt="Phisic Form" style={{ width: 24, height: 24, borderRadius: 6, objectFit: "cover", border: "1px solid " + C.border }} />
      <span style={{ color: C.silverDim, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Phisic Form</span>
    </div>
  );
}

function Shell(props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        paddingTop: "max(24px, env(safe-area-inset-top))",
        paddingBottom: "max(24px, env(safe-area-inset-bottom))",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {props.children}
    </div>
  );
}

function PageContainer(props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background: C.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "0 18px 30px",
        paddingTop: "max(18px, env(safe-area-inset-top))",
        paddingBottom: "max(30px, env(safe-area-inset-bottom))",
      }}
    >
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

function LoadingScreen() {
  return (
    <Shell>
      <Logo />
      <p style={{ color: C.silverDim, fontSize: 13 }}>Carregando...</p>
    </Shell>
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
  var stateEmail = useState(""); var email = stateEmail[0]; var setEmail = stateEmail[1];
  var statePassword = useState(""); var password = statePassword[0]; var setPassword = statePassword[1];
  var stateError = useState(""); var error = stateError[0]; var setError = stateError[1];
  var stateBusy = useState(false); var busy = stateBusy[0]; var setBusy = stateBusy[1];

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    var result = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (result.error) {
      setBusy(false);
      setError("E-mail ou senha incorretos.");
      return;
    }

    var userId = result.data.user.id;
    var profileResult = await supabase.from("profiles").select("*").eq("id", userId).single();

    setBusy(false);

    if (profileResult.error || !profileResult.data) {
      setError("Nao foi possivel carregar o perfil desta conta.");
      return;
    }

    props.onLoginSuccess(profileResult.data);
  }

  return (
    <Shell>
      <BackButton onClick={props.onBack} />
      <Logo small />
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 340 }}>
        <IconField icon={<Mail size={16} />} type="email" placeholder="E-mail" value={email} onChange={function (e) { setEmail(e.target.value); }} />
        <IconField icon={<Lock size={16} />} type="password" placeholder="Senha" value={password} onChange={function (e) { setPassword(e.target.value); }} />

        {error ? <p style={{ color: C.danger, fontSize: 12.5, margin: "0 0 10px" }}>{error}</p> : null}

        <button type="submit" disabled={busy} style={{ width: "100%", background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 14, fontWeight: 700, padding: "12px 0", cursor: "pointer", marginTop: 4, opacity: busy ? 0.7 : 1 }}>
          {busy ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p style={{ color: C.silverDim, fontSize: 12.5, marginTop: 18 }}>
        Nao tem conta?{" "}
        <span onClick={props.onGoSignup} style={{ color: C.blue, fontWeight: 700, cursor: "pointer" }}>Criar conta</span>
      </p>
    </Shell>
  );
}

function SignupScreen(props) {
  var stateName = useState(""); var name = stateName[0]; var setName = stateName[1];
  var statePhone = useState(""); var phone = statePhone[0]; var setPhone = statePhone[1];
  var stateEmail = useState(""); var email = stateEmail[0]; var setEmail = stateEmail[1];
  var statePassword = useState(""); var password = statePassword[0]; var setPassword = statePassword[1];
  var stateError = useState(""); var error = stateError[0]; var setError = stateError[1];
  var stateInfo = useState(""); var info = stateInfo[0]; var setInfo = stateInfo[1];
  var stateBusy = useState(false); var busy = stateBusy[0]; var setBusy = stateBusy[1];

  async function submit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setBusy(true);
    var cleanEmail = email.trim().toLowerCase();

    var signUpResult = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
    });

    if (signUpResult.error) {
      setBusy(false);
      setError(signUpResult.error.message);
      return;
    }

    var userId = signUpResult.data.user.id;

    var profileResult = await supabase.from("profiles").insert([
      { id: userId, name: name.trim(), phone: phone.trim(), role: "aluno" },
    ]);

    setBusy(false);

    if (profileResult.error) {
      setError("Conta criada, mas houve um erro ao salvar o perfil: " + profileResult.error.message);
      return;
    }

    if (signUpResult.data.session) {
      props.onSignupSuccess({ id: userId, name: name.trim(), phone: phone.trim(), role: "aluno" });
    } else {
      setInfo("Conta criada! Confirme seu e-mail e depois faca login.");
    }
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
        {info ? <p style={{ color: C.blue, fontSize: 12.5, margin: "0 0 10px" }}>{info}</p> : null}

        <button type="submit" disabled={busy} style={{ width: "100%", background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 14, fontWeight: 700, padding: "12px 0", cursor: "pointer", marginTop: 4, opacity: busy ? 0.7 : 1 }}>
          {busy ? "Criando..." : "Criar conta"}
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
          var history = s._lastHistory;
          var historyLabel = null;
          if (history) {
            var formatted = formatHistoryDate(history.created_at);
            historyLabel = formatted.isToday
              ? "Concluiu o Treino " + history.workout_tab + " hoje"
              : "Ultimo treino: " + formatted.label;
          }
          return (
            <button key={s.id} onClick={function () { props.onPick(s); }} style={{ display: "flex", alignItems: "center", gap: 12, background: C.panel, border: "1px solid " + C.border, borderRadius: 12, padding: "12px 14px", cursor: "pointer", textAlign: "left" }}>
              <Avatar name={s.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.white, fontSize: 15, fontWeight: 600, margin: 0 }}>{s.name}</p>
                <p style={{ color: history && formatHistoryDate(history.created_at).isToday ? C.blue : C.silverDim, fontSize: 11.5, margin: "2px 0 0", fontWeight: historyLabel ? 600 : 400 }}>
                  {historyLabel || "Sem treinos concluidos ainda"}
                </p>
              </div>
              <ChevronRight size={18} color={C.silverDim} />
            </button>
          );
        })}
      </div>
    </Shell>
  );
}

function ProgressBar(props) {
  var pct = props.total === 0 ? 0 : Math.round((props.done / props.total) * 100);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: C.silverDim, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Progresso de hoje</span>
        <span style={{ color: C.blue, fontSize: 13, fontWeight: 700 }}>{props.done}/{props.total} - {pct}%</span>
      </div>
      <div style={{ width: "100%", height: 8, background: C.panelAlt, borderRadius: 6, overflow: "hidden", border: "1px solid " + C.border }}>
        <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg, " + C.blueDim + ", " + C.blue + ")", borderRadius: 6, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

function ExerciseCard(props) {
  var ex = props.ex;
  var stateImgError = useState(false); var imgError = stateImgError[0]; var setImgError = stateImgError[1];
  var checked = !!ex.is_completed;

  return (
    <div style={{ background: checked ? "rgba(47,134,198,0.08)" : C.panel, border: "1px solid " + (checked ? C.blueDim : C.border), borderRadius: 14, overflow: "hidden" }}>
      <div style={{ width: "100%", height: 160, background: C.panelAlt }}>
        {ex.image && !imgError ? (
          <img src={ex.image} alt={ex.name} onError={function () { setImgError(true); }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={32} color={C.silverDim} />
          </div>
        )}
      </div>

      <div style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: C.white, fontSize: 14, fontWeight: 700, margin: "0 0 4px", textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.6 : 1 }}>
            {ex.name}
          </p>
          <p style={{ color: C.silverDim, fontSize: 12.5, margin: "0 0 8px" }}>{ex.sets} series x {ex.reps} reps</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ color: C.silverDim, fontSize: 12 }}>Carga</label>
            <input
              type="number" inputMode="decimal" placeholder="0"
              value={props.weight === undefined ? "" : props.weight}
              onChange={function (e) { props.onWeightChange(ex.id, e.target.value); }}
              style={{ width: 56, background: C.bg, border: "1px solid " + C.border, borderRadius: 6, color: C.white, fontSize: 13, padding: "4px 6px", outline: "none" }}
            />
            <span style={{ color: C.silverDim, fontSize: 12 }}>kg</span>
          </div>
        </div>

        <button onClick={function () { props.onToggle(ex); }} aria-label="Marcar exercicio" style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid " + (checked ? C.blue : C.border), background: checked ? C.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Check size={18} color={checked ? C.white : C.silverDim} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

// Modal de resumo exibido ao finalizar o treino do dia.
function FinishWorkoutModal(props) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, zIndex: 50,
      }}
    >
      <div style={{ width: "100%", maxWidth: 320, background: C.panel, border: "1px solid " + C.blueDim, borderRadius: 16, padding: 24, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.blueDeep, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <PartyPopper size={26} color={C.blue} />
        </div>
        <p style={{ color: C.white, fontSize: 16, fontWeight: 800, margin: "0 0 6px" }}>
          Parabens, {props.name}!
        </p>
        <p style={{ color: C.silverDim, fontSize: 13, margin: "0 0 20px" }}>
          Treino concluido. 🔥
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={props.onClearForTomorrow}
            disabled={props.clearing}
            style={{ background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 13.5, fontWeight: 700, padding: "11px 0", cursor: "pointer", opacity: props.clearing ? 0.7 : 1 }}
          >
            {props.clearing ? "Preparando..." : "Limpar para amanha"}
          </button>
          <button
            onClick={props.onClose}
            style={{ background: "transparent", border: "1px solid " + C.border, borderRadius: 8, color: C.silverDim, fontSize: 13.5, fontWeight: 700, padding: "11px 0", cursor: "pointer" }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// Painel do aluno: le/atualiza exercicios (com is_completed persistido) e
// registra o historico ao finalizar o treino do dia.
function AlunoDashboard(props) {
  var student = props.student;
  var stateTab = useState("A"); var tab = stateTab[0]; var setTab = stateTab[1];
  var stateWorkout = useState({ A: [], B: [], C: [] }); var workout = stateWorkout[0]; var setWorkout = stateWorkout[1];
  var stateLoading = useState(true); var loading = stateLoading[0]; var setLoading = stateLoading[1];
  var stateWeights = useState({}); var weights = stateWeights[0]; var setWeights = stateWeights[1];
  var stateFinishing = useState(false); var finishing = stateFinishing[0]; var setFinishing = stateFinishing[1];
  var stateShowModal = useState(false); var showModal = stateShowModal[0]; var setShowModal = stateShowModal[1];
  var stateClearing = useState(false); var clearing = stateClearing[0]; var setClearing = stateClearing[1];

  useEffect(function () {
    var cancelled = false;
    async function loadExercises() {
      setLoading(true);
      var result = await supabase.from("exercises").select("*").eq("student_id", student.id).order("created_at", { ascending: true });
      if (!cancelled) {
        if (!result.error && result.data) {
          setWorkout(groupByTab(result.data));
        }
        setLoading(false);
      }
    }
    loadExercises();
    return function () { cancelled = true; };
  }, [student.id]);

  // Marca/desmarca o exercicio e grava is_completed direto no Supabase.
  async function toggle(ex) {
    var newValue = !ex.is_completed;
    setWorkout(function (prev) {
      var next = Object.assign({}, prev);
      next[tab] = next[tab].map(function (e) { return e.id === ex.id ? Object.assign({}, e, { is_completed: newValue }) : e; });
      return next;
    });
    var result = await supabase.from("exercises").update({ is_completed: newValue }).eq("id", ex.id);
    if (result.error) {
      // reverte em caso de falha
      setWorkout(function (prev) {
        var next = Object.assign({}, prev);
        next[tab] = next[tab].map(function (e) { return e.id === ex.id ? Object.assign({}, e, { is_completed: !newValue }) : e; });
        return next;
      });
    }
  }

  function setWeight(exId, val) {
    var key = student.id + "-" + tab + "-" + exId;
    setWeights(function (prev) {
      var next = Object.assign({}, prev);
      next[key] = val;
      return next;
    });
  }

  async function finishWorkout() {
    setFinishing(true);
    var result = await supabase.from("workout_history").insert([
      { student_id: student.id, workout_tab: tab },
    ]);
    setFinishing(false);
    if (!result.error) {
      setShowModal(true);
    }
  }

  async function clearForTomorrow() {
    setClearing(true);
    var result = await supabase
      .from("exercises")
      .update({ is_completed: false })
      .eq("student_id", student.id)
      .eq("workout_tab", tab);
    setClearing(false);
    if (!result.error) {
      setWorkout(function (prev) {
        var next = Object.assign({}, prev);
        next[tab] = next[tab].map(function (e) { return Object.assign({}, e, { is_completed: false }); });
        return next;
      });
      setShowModal(false);
    }
  }

  var list = workout[tab];
  var doneCount = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].is_completed) doneCount++;
  }

  return (
    <PageContainer>
      <TopBrandBar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={student.name} size={38} />
          <div>
            <p style={{ color: C.white, fontSize: 15, fontWeight: 800, margin: 0 }}>Treino de {student.name.split(" ")[0]}</p>
            <p style={{ color: C.silverDim, fontSize: 11.5, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
              <Phone size={11} /> {student.phone}
            </p>
          </div>
        </div>
        <button onClick={props.onExit} aria-label="Sair" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid " + C.border, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <LogOut size={16} color={C.silverDim} />
        </button>
      </div>

      <div style={{ paddingTop: 18, display: "flex", gap: 8 }}>
        {TABS.map(function (k) {
          var active = k === tab;
          return (
            <button key={k} onClick={function () { setTab(k); }} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "1px solid " + (active ? C.blue : C.border), background: active ? C.blueDeep : C.panel, color: active ? C.white : C.silverDim, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Treino {k}
            </button>
          );
        })}
      </div>

      <div style={{ paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Flame size={16} color={C.blue} />
          <h2 style={{ color: C.white, fontSize: 16, fontWeight: 800, margin: 0 }}>Treino {tab}</h2>
        </div>

        <ProgressBar done={doneCount} total={list.length} />

        {loading ? (
          <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Carregando treino...</p>
        ) : (
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
                  weight={weights[student.id + "-" + tab + "-" + ex.id]}
                  onToggle={toggle}
                  onWeightChange={setWeight}
                />
              );
            })}
          </div>
        )}

        {!loading && list.length > 0 ? (
          <button
            onClick={finishWorkout}
            disabled={finishing}
            style={{
              width: "100%", marginTop: 18, background: C.blue, border: "none", borderRadius: 10,
              color: C.white, fontSize: 14, fontWeight: 700, padding: "13px 0", cursor: "pointer",
              opacity: finishing ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Flame size={16} />
            {finishing ? "Salvando..." : "Finalizar Treino de Hoje"}
          </button>
        ) : null}
      </div>

      {showModal ? (
        <FinishWorkoutModal
          name={student.name.split(" ")[0]}
          clearing={clearing}
          onClearForTomorrow={clearForTomorrow}
          onClose={function () { setShowModal(false); }}
        />
      ) : null}
    </PageContainer>
  );
}

function ProfessorExerciseRow(props) {
  var ex = props.ex;
  var stateEditing = useState(false); var editing = stateEditing[0]; var setEditing = stateEditing[1];
  var stateName = useState(ex.name); var name = stateName[0]; var setName = stateName[1];
  var stateSets = useState(String(ex.sets)); var sets = stateSets[0]; var setSets = stateSets[1];
  var stateReps = useState(ex.reps); var reps = stateReps[0]; var setReps = stateReps[1];
  var stateImage = useState(ex.image || ""); var image = stateImage[0]; var setImage = stateImage[1];

  function cancelEdit() {
    setName(ex.name);
    setSets(String(ex.sets));
    setReps(ex.reps);
    setImage(ex.image || "");
    setEditing(false);
  }

  function saveEdit() {
    if (!name.trim()) return;
    props.onSave(ex.id, {
      name: name.trim(),
      sets: Number(sets) || 1,
      reps: reps.trim() || "-",
      image: image.trim() || IMG_GERAL,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div style={{ background: C.panelAlt, border: "1px solid " + C.blueDim, borderRadius: 12, padding: 12 }}>
        <input type="text" placeholder="Nome do exercicio" value={name} onChange={function (e) { setName(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input type="number" placeholder="Series" value={sets} onChange={function (e) { setSets(e.target.value); }} style={Object.assign({}, plainInputStyle, { width: 70 })} />
          <input type="text" placeholder="Repeticoes" value={reps} onChange={function (e) { setReps(e.target.value); }} style={Object.assign({}, plainInputStyle, { flex: 1 })} />
        </div>
        <input type="text" placeholder="URL da imagem/GIF" value={image} onChange={function (e) { setImage(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 10 })} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveEdit} style={{ flex: 1, background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 13, fontWeight: 700, padding: "9px 0", cursor: "pointer" }}>
            Salvar
          </button>
          <button onClick={cancelEdit} style={{ flex: 1, background: "transparent", border: "1px solid " + C.border, borderRadius: 8, color: C.silverDim, fontSize: 13, fontWeight: 700, padding: "9px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <X size={14} /> Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.panel, border: "1px solid " + C.border, borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: C.panelAlt }}>
        <img src={ex.image || IMG_GERAL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: C.white, fontSize: 13.5, fontWeight: 700, margin: 0 }}>{ex.name}</p>
        <p style={{ color: C.silverDim, fontSize: 12, margin: 0 }}>{ex.sets} series x {ex.reps} reps</p>
      </div>
      <button onClick={function () { setEditing(true); }} aria-label="Editar exercicio" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid " + C.border, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <Pencil size={14} color={C.blue} />
      </button>
      <button onClick={function () { props.onDelete(ex.id); }} aria-label="Excluir exercicio" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid " + C.border, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <Trash2 size={15} color={C.danger} />
      </button>
    </div>
  );
}

// Painel do professor. Ao carregar a lista de alunos, tambem busca o
// historico de treinos (workout_history) e anexa o mais recente de cada um
// em s._lastHistory, exibido pelo StudentPicker.
function ProfessorPanel(props) {
  var stateStudents = useState([]); var students = stateStudents[0]; var setStudents = stateStudents[1];
  var stateLoadingStudents = useState(true); var loadingStudents = stateLoadingStudents[0]; var setLoadingStudents = stateLoadingStudents[1];

  var stateSelected = useState(null); var selectedStudent = stateSelected[0]; var setSelectedStudent = stateSelected[1];
  var stateTab = useState("A"); var tab = stateTab[0]; var setTab = stateTab[1];
  var stateWorkout = useState({ A: [], B: [], C: [] }); var workout = stateWorkout[0]; var setWorkout = stateWorkout[1];
  var stateLoadingWorkout = useState(false); var loadingWorkout = stateLoadingWorkout[0]; var setLoadingWorkout = stateLoadingWorkout[1];

  var stateName = useState(""); var newName = stateName[0]; var setNewName = stateName[1];
  var stateSets = useState("3"); var newSets = stateSets[0]; var setNewSets = stateSets[1];
  var stateReps = useState("10-12"); var newReps = stateReps[0]; var setNewReps = stateReps[1];
  var stateImage = useState(""); var newImage = stateImage[0]; var setNewImage = stateImage[1];

  useEffect(function () {
    async function loadStudentsAndHistory() {
      setLoadingStudents(true);
      var studentsResult = await supabase.from("profiles").select("*").eq("role", "aluno");
      if (studentsResult.error || !studentsResult.data) {
        setLoadingStudents(false);
        return;
      }

      var historyResult = await supabase
        .from("workout_history")
        .select("*")
        .order("created_at", { ascending: false });

      var latestByStudent = {};
      if (!historyResult.error && historyResult.data) {
        for (var i = 0; i < historyResult.data.length; i++) {
          var row = historyResult.data[i];
          if (!latestByStudent[row.student_id]) {
            latestByStudent[row.student_id] = row;
          }
        }
      }

      var enriched = studentsResult.data.map(function (s) {
        return Object.assign({}, s, { _lastHistory: latestByStudent[s.id] || null });
      });

      setStudents(enriched);
      setLoadingStudents(false);
    }
    loadStudentsAndHistory();
  }, []);

  useEffect(function () {
    if (!selectedStudent) return;
    var cancelled = false;
    async function loadWorkout() {
      setLoadingWorkout(true);
      var result = await supabase.from("exercises").select("*").eq("student_id", selectedStudent.id).order("created_at", { ascending: true });
      if (!cancelled) {
        if (!result.error && result.data) setWorkout(groupByTab(result.data));
        setLoadingWorkout(false);
      }
    }
    loadWorkout();
    return function () { cancelled = true; };
  }, [selectedStudent]);

  if (!selectedStudent) {
    return (
      <StudentPicker
        title={loadingStudents ? "Carregando alunos..." : "Selecione o aluno para editar o treino"}
        onPick={setSelectedStudent}
        onBack={props.onExit}
        students={students}
      />
    );
  }

  var list = workout[tab];

  async function addExercise() {
    if (!newName.trim()) return;
    var payload = {
      student_id: selectedStudent.id,
      workout_tab: tab,
      name: newName.trim(),
      sets: Number(newSets) || 1,
      reps: newReps.trim() || "-",
      image: newImage.trim() || IMG_GERAL,
    };
    var result = await supabase.from("exercises").insert([payload]).select();
    if (!result.error && result.data) {
      setWorkout(function (prev) {
        var next = Object.assign({}, prev);
        next[tab] = next[tab].concat(result.data);
        return next;
      });
      setNewName("");
      setNewSets("3");
      setNewReps("10-12");
      setNewImage("");
    }
  }

  async function saveEditExercise(exId, updates) {
    var result = await supabase.from("exercises").update(updates).eq("id", exId).select();
    if (!result.error && result.data && result.data.length > 0) {
      var updatedRow = result.data[0];
      setWorkout(function (prev) {
        var next = Object.assign({}, prev);
        next[tab] = next[tab].map(function (e) { return e.id === exId ? updatedRow : e; });
        return next;
      });
    }
  }

  async function deleteExercise(exId) {
    var result = await supabase.from("exercises").delete().eq("id", exId);
    if (!result.error) {
      setWorkout(function (prev) {
        var next = Object.assign({}, prev);
        next[tab] = next[tab].filter(function (e) { return e.id !== exId; });
        return next;
      });
    }
  }

  return (
    <PageContainer>
      <TopBrandBar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={function () { setSelectedStudent(null); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: C.silverDim, fontSize: 12.5, cursor: "pointer" }}>
          <ArrowLeft size={14} /> Trocar aluno
        </button>
        <button onClick={props.onExit} aria-label="Sair" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid " + C.border, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <LogOut size={16} color={C.silverDim} />
        </button>
      </div>

      <div style={{ paddingTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={selectedStudent.name} size={38} />
        <div>
          <p style={{ color: C.white, fontSize: 15, fontWeight: 800, margin: 0 }}>Treino de {selectedStudent.name.split(" ")[0]}</p>
          <p style={{ color: C.silverDim, fontSize: 11.5, margin: 0 }}>Painel do professor - {selectedStudent.phone}</p>
        </div>
      </div>

      <div style={{ paddingTop: 18, display: "flex", gap: 8 }}>
        {TABS.map(function (k) {
          var active = k === tab;
          return (
            <button key={k} onClick={function () { setTab(k); }} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "1px solid " + (active ? C.blue : C.border), background: active ? C.blueDeep : C.panel, color: active ? C.white : C.silverDim, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Treino {k}
            </button>
          );
        })}
      </div>

      <div style={{ paddingTop: 16 }}>
        {loadingWorkout ? (
          <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center", padding: "12px 0" }}>Carregando exercicios...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {list.length === 0 ? (
              <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center", padding: "12px 0" }}>Nenhum exercicio neste treino. Adicione um abaixo.</p>
            ) : null}
            {list.map(function (ex) {
              return (
                <ProfessorExerciseRow
                  key={ex.id}
                  ex={ex}
                  onSave={saveEditExercise}
                  onDelete={deleteExercise}
                />
              );
            })}
          </div>
        )}

        <div style={{ background: C.panelAlt, border: "1px solid " + C.border, borderRadius: 12, padding: 12 }}>
          <p style={{ color: C.silverDim, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Adicionar exercicio</p>
          <input type="text" placeholder="Nome do exercicio" value={newName} onChange={function (e) { setNewName(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input type="number" placeholder="Series" value={newSets} onChange={function (e) { setNewSets(e.target.value); }} style={Object.assign({}, plainInputStyle, { width: 70 })} />
            <input type="text" placeholder="Repeticoes (ex: 10-12)" value={newReps} onChange={function (e) { setNewReps(e.target.value); }} style={Object.assign({}, plainInputStyle, { flex: 1 })} />
          </div>
          <input type="text" placeholder="URL da imagem/GIF (opcional)" value={newImage} onChange={function (e) { setNewImage(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 10 })} />
          <button onClick={addExercise} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 13, fontWeight: 700, padding: "10px 0", cursor: "pointer" }}>
            <Plus size={15} /> Adicionar
          </button>
        </div>
      </div>
    </PageContainer>
  );
}

export default function App() {
  var stateScreen = useState("loading"); var screen = stateScreen[0]; var setScreen = stateScreen[1];
  var stateRole = useState(null); var currentRole = stateRole[0]; var setCurrentRole = stateRole[1];
  var stateProfile = useState(null); var currentProfile = stateProfile[0]; var setCurrentProfile = stateProfile[1];
  var stateTeacherStudent = useState(null); var teacherStudent = stateTeacherStudent[0]; var setTeacherStudent = stateTeacherStudent[1];

  useEffect(function () {
    async function restoreSession() {
      var sessionResult = await supabase.auth.getSession();
      var session = sessionResult.data.session;
      if (!session) {
        setScreen("welcome");
        return;
      }
      var profileResult = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (profileResult.error || !profileResult.data) {
        setScreen("welcome");
        return;
      }
      setCurrentProfile(profileResult.data);
      setCurrentRole(profileResult.data.role);
      setScreen("app");
    }
    restoreSession();
  }, []);

  function handleAuthSuccess(profile) {
    setCurrentProfile(profile);
    setCurrentRole(profile.role);
    setScreen("app");
  }

  async function logout() {
    await supabase.auth.signOut();
    setCurrentRole(null);
    setCurrentProfile(null);
    setTeacherStudent(null);
    setScreen("welcome");
  }

  var content = null;

  if (screen === "loading") {
    content = <LoadingScreen />;
  } else if (screen === "welcome") {
    content = <WelcomeScreen onGoLogin={function () { setScreen("login"); }} onGoSignup={function () { setScreen("signup"); }} />;
  } else if (screen === "login") {
    content = <LoginScreen onBack={function () { setScreen("welcome"); }} onLoginSuccess={handleAuthSuccess} onGoSignup={function () { setScreen("signup"); }} />;
  } else if (screen === "signup") {
    content = <SignupScreen onBack={function () { setScreen("welcome"); }} onSignupSuccess={handleAuthSuccess} />;
  } else if (currentRole === "aluno") {
    content = <AlunoDashboard student={currentProfile} onExit={logout} />;
  } else {
    content = (
      <ProfessorPanel
        selectedStudent={teacherStudent}
        onChangeStudent={setTeacherStudent}
        onExit={logout}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg }}>
      <div style={{ width: "100%", maxWidth: 420, margin: "0 auto", minHeight: "100vh" }}>
        {content}
      </div>
    </div>
  );
}
