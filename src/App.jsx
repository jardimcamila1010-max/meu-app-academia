import React, { useState, useEffect } from "react";
import {
  Check,
  LogOut,
  ChevronRight,
  ChevronLeft,
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
  Loader2,
  Eye,
  BookOpen,
  Play,
  Lock as LockIcon,
  CheckCircle2,
  Coffee,
  Rocket,
  FileEdit,
} from "lucide-react";
import { supabase } from "./supabaseClient.js";

var LOGO_URL = "https://i.postimg.cc/NLQPwFC2/Whats-App-Image-2026-07-14-at-17-04-16.jpg";
var DEFAULT_CATEGORY = "Geral";

var DAY_TABS = [
  { key: "segunda", label: "S" },
  { key: "terca", label: "T" },
  { key: "quarta", label: "Q" },
  { key: "quinta", label: "Q" },
  { key: "sexta", label: "S" },
  { key: "sabado", label: "S" },
  { key: "domingo", label: "D" },
];
var DAY_FULL_LABEL = {
  domingo: "Domingo",
  segunda: "Segunda-feira",
  terca: "Terca-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sabado",
};

var INCENTIVE_PHRASES = [
  "O segredo do sucesso e a constancia!",
  "Treino pago! Agora foque na sua alimentacao e descanso.",
  "Voce esta mais perto do seu objetivo hoje!",
  "Disciplina vence motivacao. Ate amanha!",
  "Cada treino concluido e um tijolo na sua evolucao.",
  "Corpo cansado, missao cumprida. Descanse bem!",
  "Hoje foi mais um dia que voce nao desistiu.",
];

var C = {
  bg: "#11161d",
  panel: "#171e27",
  panelAlt: "#1e2733",
  border: "#2a3542",
  silverDim: "#8b98a5",
  blue: "#2f86c6",
  weightBlue: "#60a5fa",
  blueDim: "#1d5a8c",
  blueDeep: "#123a5c",
  white: "#f3f5f7",
  danger: "#c65a5a",
  success: "#3fae6a",
  warning: "#c99a3f",
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

var textareaStyle = Object.assign({}, plainInputStyle, { resize: "vertical", minHeight: 60, fontFamily: "inherit" });

function groupByDay(rows) {
  var grouped = {};
  for (var i = 0; i < DAY_TABS.length; i++) grouped[DAY_TABS[i].key] = [];
  for (var j = 0; j < rows.length; j++) {
    var row = rows[j];
    if (row.scheduled_day && grouped[row.scheduled_day]) grouped[row.scheduled_day].push(row);
  }
  return grouped;
}

// Agrupa uma lista de itens (exercicios do dia OU itens da biblioteca) por
// category, mantendo a ordem de primeira aparicao. Sem categoria = "Geral".
function groupByCategory(rows) {
  var order = [];
  var grouped = {};
  for (var i = 0; i < rows.length; i++) {
    var cat = (rows[i].category && rows[i].category.trim()) ? rows[i].category.trim() : DEFAULT_CATEGORY;
    if (!grouped[cat]) {
      grouped[cat] = [];
      order.push(cat);
    }
    grouped[cat].push(rows[i]);
  }
  return order.map(function (cat) { return { category: cat, items: grouped[cat] }; });
}

function getDayKeyForDate(date) {
  var day = date.getDay();
  var map = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  return map[day];
}

function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function stripTime(d) {
  var copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function toDateOnlyString(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function getMondayOfWeek(date) {
  var d = new Date(date);
  var day = d.getDay();
  var diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildWeekDays(referenceDate) {
  var monday = getMondayOfWeek(referenceDate);
  var days = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

// Grid de calendario mensal, sempre comecando na segunda-feira (5 ou 6 semanas).
function buildMonthCells(baseDate) {
  var year = baseDate.getFullYear();
  var month = baseDate.getMonth();
  var firstOfMonth = new Date(year, month, 1);
  var startDay = firstOfMonth.getDay();
  var mondayOffset = startDay === 0 ? 6 : startDay - 1;
  var gridStart = new Date(year, month, 1 - mondayOffset);

  var lastOfMonth = new Date(year, month + 1, 0);
  var daysInMonth = lastOfMonth.getDate();
  var totalCellsNeeded = mondayOffset + daysInMonth;
  var totalWeeks = Math.ceil(totalCellsNeeded / 7);

  var cells = [];
  for (var i = 0; i < totalWeeks * 7; i++) {
    var d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }
  return cells;
}

function findHistoryForDate(records, date) {
  for (var j = 0; j < records.length; j++) {
    if (isSameDate(new Date(records[j].created_at), date)) return records[j];
  }
  return null;
}

function getPreviousWeight(historyRecords, exerciseName, beforeDate) {
  var candidates = historyRecords
    .filter(function (r) { return new Date(r.created_at).getTime() < beforeDate.getTime() && r.summary_data; })
    .sort(function (a, b) { return new Date(b.created_at) - new Date(a.created_at); });

  for (var i = 0; i < candidates.length; i++) {
    var items = candidates[i].summary_data;
    for (var j = 0; j < items.length; j++) {
      if (items[j].name === exerciseName && items[j].weight) {
        var parsed = parseFloat(String(items[j].weight).replace(",", "."));
        if (!isNaN(parsed)) return parsed;
      }
    }
  }
  return null;
}

function formatFriendlyDate(input) {
  var d = typeof input === "string" ? new Date(input) : input;
  var raw = d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  var commaIndex = raw.indexOf(",");
  if (commaIndex === -1) return raw;
  var weekday = raw.slice(0, commaIndex);
  var rest = raw.slice(commaIndex + 2);
  var weekdayCap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  var restCap = rest.replace(/de (\p{L})/u, function (m, c) { return "de " + c.toUpperCase(); });
  return weekdayCap + ", " + restCap;
}

function formatMonthLabel(d) {
  var raw = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function formatTime(input) {
  var d = typeof input === "string" ? new Date(input) : input;
  var hh = String(d.getHours()).padStart(2, "0");
  var mm = String(d.getMinutes()).padStart(2, "0");
  return hh + ":" + mm;
}

function pickRandomPhrase() {
  var i = Math.floor(Math.random() * INCENTIVE_PHRASES.length);
  return INCENTIVE_PHRASES[i];
}

function getSectionTitle(isPast, isToday, dayKey) {
  if (isPast) return "Relatorio do Dia";
  if (isToday) return "Treino de Hoje";
  return "Planejamento de " + DAY_FULL_LABEL[dayKey];
}

function Spinner(props) {
  var size = props.size || 16;
  return (
    <React.Fragment>
      <style>{"@keyframes phisic-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
      <Loader2 size={size} color={props.color || C.white} style={{ animation: "phisic-spin 0.8s linear infinite" }} />
    </React.Fragment>
  );
}

// Miniatura de imagem com fallback elegante: se nao houver src ou o link
// quebrar, mostra fundo cinza escuro (panelAlt) com o icone ImageIcon
// centralizado, em vez de deixar um espaco vazio ou feio.
function ImageThumb(props) {
  var stateError = useState(false); var imgError = stateError[0]; var setImgError = stateError[1];
  var size = props.size || 44;
  var iconSize = props.iconSize || Math.round((typeof size === "number" ? size : 44) * 0.45);
  var hasSrc = !!(props.src && props.src.trim());
  var showImage = hasSrc && !imgError;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: props.radius === 0 ? 0 : (props.radius || 8),
        overflow: "hidden",
        flexShrink: 0,
        background: C.panelAlt,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showImage ? (
        <img
          src={props.src}
          alt={props.alt || ""}
          onError={function () { setImgError(true); }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <ImageIcon size={iconSize} color={C.silverDim} />
      )}
    </div>
  );
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

        <button type="submit" disabled={busy} style={{ width: "100%", background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 14, fontWeight: 700, padding: "12px 0", cursor: "pointer", marginTop: 4, opacity: busy ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {busy ? <Spinner size={15} /> : null}
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
      props.onSignupSuccess({ id: userId, name: name.trim(), phone: phone.trim(), role: "aluno", workout_started_at: null });
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

        <button type="submit" disabled={busy} style={{ width: "100%", background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 14, fontWeight: 700, padding: "12px 0", cursor: "pointer", marginTop: 4, opacity: busy ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {busy ? <Spinner size={15} /> : null}
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

      <button
        onClick={props.onOpenLibrary}
        style={{
          width: "100%", maxWidth: 380, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: C.panelAlt, border: "1px solid " + C.blueDim, borderRadius: 10, color: C.blue,
          fontSize: 13, fontWeight: 700, padding: "10px 0", cursor: "pointer", marginBottom: 18,
        }}
      >
        <BookOpen size={15} /> Gerenciar Biblioteca Geral
      </button>

      <p style={{ color: C.silverDim, fontSize: 13, marginBottom: 20, marginTop: -8 }}>{props.title}</p>
      <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 }}>
        {students.length === 0 ? (
          <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center" }}>Nenhum aluno cadastrado ainda.</p>
        ) : null}
        {students.map(function (s) {
          var history = s._lastHistory;
          var historyLabel = null;
          var isToday = false;
          if (history) {
            var histDate = new Date(history.created_at);
            isToday = isSameDate(histDate, new Date());
            historyLabel = isToday
              ? "Concluiu o treino de hoje"
              : "Ultimo treino: " + formatFriendlyDate(histDate);
          }
          return (
            <button
              key={s.id}
              onClick={function () { props.onPick(s); }}
              style={{ display: "flex", alignItems: "center", gap: 12, background: C.panel, border: "1px solid " + C.border, borderRadius: 12, padding: "12px 14px", cursor: "pointer", textAlign: "left" }}
            >
              <Avatar name={s.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.white, fontSize: 15, fontWeight: 600, margin: 0 }}>{s.name}</p>
                <p style={{ color: isToday ? C.blue : C.silverDim, fontSize: 11.5, margin: "2px 0 0", fontWeight: historyLabel ? 600 : 400 }}>
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

function PressableProfileHeader(props) {
  var statePressed = useState(false); var pressed = statePressed[0]; var setPressed = statePressed[1];

  return (
    <button
      onClick={props.onClick}
      onMouseDown={function () { setPressed(true); }}
      onMouseUp={function () { setPressed(false); }}
      onMouseLeave={function () { setPressed(false); }}
      onTouchStart={function () { setPressed(true); }}
      onTouchEnd={function () { setPressed(false); }}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        background: pressed ? C.panelAlt : "transparent",
        border: "none", borderRadius: 12, padding: "6px 8px", margin: "-6px -8px",
        cursor: "pointer", textAlign: "left",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "transform 0.12s ease, background 0.12s ease",
      }}
    >
      <Avatar name={props.name} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <p style={{ color: C.white, fontSize: 15, fontWeight: 800, margin: 0 }}>{props.title}</p>
          <ChevronRight size={15} color={C.silverDim} />
        </div>
        {props.subtitle ? (
          <p style={{ color: C.silverDim, fontSize: 11.5, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
            {props.subtitle}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function WeekCircleRow(props) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 8 }}>
      {props.items.map(function (item) {
        var fillColor = item.highlightColor || C.blue;
        return (
          <button
            key={item.key}
            onClick={item.onClick}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1, background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
          >
            <span style={{ color: C.silverDim, fontSize: 10.5, fontWeight: 700 }}>{item.topLabel}</span>
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: item.highlighted ? fillColor : C.panelAlt,
                border: "2px solid " + (item.ringActive ? fillColor : C.border),
                color: item.highlighted ? C.white : C.silverDim,
                fontSize: 11, fontWeight: 700,
              }}
            >
              {item.circleText}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CompletedDayView(props) {
  var record = props.record;
  var allRecords = props.allRecords || [];
  var recordDate = new Date(record.created_at);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <CheckCircle2 size={18} color={C.success} />
        <p style={{ color: C.success, fontSize: 14, fontWeight: 800, margin: 0 }}>Treino Finalizado</p>
      </div>

      {props.phrase ? (
        <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <p style={{ color: C.white, fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>"{props.phrase}"</p>
        </div>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.panel, border: "1px solid " + C.blueDim, borderRadius: 12, padding: 14, marginBottom: record.summary_data ? 10 : 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.blueDeep, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Flame size={18} color={C.blue} />
        </div>
        <p style={{ color: C.white, fontSize: 13.5, margin: 0 }}>
          Treino concluido as <b>{formatTime(record.created_at)}</b>
        </p>
      </div>

      {record.summary_data && record.summary_data.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {record.summary_data.map(function (item, idx) {
            var showEvolution = false;
            if (item.weight) {
              var currentWeight = parseFloat(String(item.weight).replace(",", "."));
              var previousWeight = getPreviousWeight(allRecords, item.name, recordDate);
              if (!isNaN(currentWeight) && previousWeight !== null && currentWeight > previousWeight) {
                showEvolution = true;
              }
            }
            return (
              <div key={idx} style={{ background: C.panel, border: "1px solid " + (showEvolution ? C.success : C.border), borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: C.white, fontSize: 13 }}>{item.name}</span>
                  <span style={{ color: C.weightBlue, fontSize: 14, fontWeight: 800 }}>
                    {item.weight ? item.weight + "KG" : "-"}
                  </span>
                </div>
                {showEvolution ? (
                  <p style={{ color: C.success, fontSize: 11.5, fontWeight: 700, margin: "4px 0 0" }}>
                    🔥 Evolucao! Voce aumentou a carga neste aparelho
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {props.onViewPlan ? (
        <button
          onClick={props.onViewPlan}
          style={{ width: "100%", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "transparent", border: "1px solid " + C.border, borderRadius: 8, color: C.silverDim, fontSize: 12.5, fontWeight: 600, padding: "9px 0", cursor: "pointer" }}
        >
          <Eye size={14} /> Ver plano de hoje novamente
        </button>
      ) : null}
    </div>
  );
}

function RestOrNoRecordMessage() {
  return (
    <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 12, padding: "22px 16px", textAlign: "center" }}>
      <Coffee size={22} color={C.silverDim} style={{ marginBottom: 8 }} />
      <p style={{ color: C.silverDim, fontSize: 13, margin: 0 }}>
        ☕ Dia de descanso ou sem registro de atividade.
      </p>
    </div>
  );
}

function MonthlyHistoryScreen(props) {
  var stateMonth = useState(function () { var d = new Date(); d.setDate(1); return d; });
  var monthDate = stateMonth[0]; var setMonthDate = stateMonth[1];
  var stateSelectedDay = useState(null); var selectedDay = stateSelectedDay[0]; var setSelectedDay = stateSelectedDay[1];

  var today = new Date();
  var cells = buildMonthCells(monthDate);
  var weeks = [];
  for (var i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  function goPrevMonth() {
    var d = new Date(monthDate);
    d.setMonth(d.getMonth() - 1);
    setMonthDate(d);
    setSelectedDay(null);
  }
  function goNextMonth() {
    var d = new Date(monthDate);
    d.setMonth(d.getMonth() + 1);
    setMonthDate(d);
    setSelectedDay(null);
  }

  var selectedRecord = selectedDay ? findHistoryForDate(props.historyRecords, selectedDay) : null;

  return (
    <PageContainer>
      <TopBrandBar />
      <button onClick={props.onClose} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: C.silverDim, fontSize: 13, cursor: "pointer", marginBottom: 12 }}>
        <ArrowLeft size={15} /> Voltar
      </button>

      <p style={{ color: C.white, fontSize: 17, fontWeight: 800, margin: "0 0 4px" }}>Historico Completo</p>
      <p style={{ color: C.silverDim, fontSize: 12.5, margin: "0 0 18px" }}>{props.studentName}</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={goPrevMonth} aria-label="Mes anterior" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid " + C.border, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={16} color={C.silverDim} />
        </button>
        <p style={{ color: C.white, fontSize: 14.5, fontWeight: 700, margin: 0 }}>{formatMonthLabel(monthDate)}</p>
        <button onClick={goNextMonth} aria-label="Proximo mes" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid " + C.border, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronRight size={16} color={C.silverDim} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {DAY_TABS.map(function (d) {
          return <div key={d.key} style={{ textAlign: "center", color: C.silverDim, fontSize: 10, fontWeight: 700 }}>{d.label}</div>;
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 18 }}>
        {weeks.map(function (week, wi) {
          return (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {week.map(function (d, di) {
                var inMonth = d.getMonth() === monthDate.getMonth();
                var hasRecord = !!findHistoryForDate(props.historyRecords, d);
                var isToday = isSameDate(d, today);
                var isSelected = selectedDay && isSameDate(d, selectedDay);
                var bgColor = hasRecord ? C.success : (isToday ? C.blue : C.panelAlt);
                return (
                  <button
                    key={di}
                    onClick={function () { setSelectedDay(d); }}
                    style={{
                      aspectRatio: "1", borderRadius: 8,
                      background: bgColor,
                      border: "2px solid " + (isSelected ? C.white : C.border),
                      color: inMonth ? ((hasRecord || isToday) ? C.white : C.silverDim) : "#4a5563",
                      fontSize: 11.5, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", opacity: inMonth ? 1 : 0.45,
                    }}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {selectedDay ? (
        selectedRecord ? (
          <div>
            <p style={{ color: C.silverDim, fontSize: 12, margin: "0 0 10px" }}>{formatFriendlyDate(selectedDay)}</p>
            <CompletedDayView record={selectedRecord} allRecords={props.historyRecords} />
          </div>
        ) : (
          <div>
            <p style={{ color: C.silverDim, fontSize: 12, margin: "0 0 10px" }}>{formatFriendlyDate(selectedDay)}</p>
            <RestOrNoRecordMessage />
          </div>
        )
      ) : (
        <p style={{ color: C.silverDim, fontSize: 12.5, textAlign: "center", padding: "10px 0" }}>Toque em um dia para ver o resumo do treino.</p>
      )}
    </PageContainer>
  );
}

function ExerciseDetailModal(props) {
  var ex = props.ex;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 70, overflowY: "auto" }}
      onClick={props.onClose}
    >
      <div onClick={function (e) { e.stopPropagation(); }} style={{ width: "100%", maxWidth: 360, background: C.panel, border: "1px solid " + C.blueDim, borderRadius: 16, padding: 20, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ color: C.white, fontSize: 15, fontWeight: 800, margin: 0 }}>{ex.name}</p>
          <button onClick={props.onClose} aria-label="Fechar" style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid " + C.border, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <X size={14} color={C.silverDim} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 130 }}>
            <ImageThumb src={ex.image} alt={ex.name + " posicao 1"} size="100%" radius={10} iconSize={22} />
          </div>
          <div style={{ flex: 1, height: 130 }}>
            <ImageThumb src={ex.image2} alt={ex.name + " posicao 2"} size="100%" radius={10} iconSize={22} />
          </div>
        </div>

        <p style={{ color: C.silverDim, fontSize: 12.5, margin: "0 0 10px" }}>{ex.sets} series x {ex.reps} reps</p>

        {ex.notes ? (
          <div style={{ background: C.panelAlt, border: "1px solid " + C.border, borderRadius: 10, padding: 12 }}>
            <p style={{ color: C.silverDim, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>Observacoes Tecnicas</p>
            <p style={{ color: C.white, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{ex.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ExerciseCard(props) {
  var ex = props.ex;
  var checked = !!ex.is_completed;
  var currentWeightValue = props.weight !== undefined ? props.weight : (ex.weight != null ? String(ex.weight) : "");

  return (
    <div style={{ background: checked ? "rgba(47,134,198,0.08)" : C.panel, border: "1px solid " + (checked ? C.blueDim : C.border), borderRadius: 14, overflow: "hidden" }}>
      <div style={{ width: "100%", height: 160, cursor: "pointer" }} onClick={function () { props.onOpenDetail(ex); }}>
        <ImageThumb src={ex.image} alt={ex.name} size="100%" radius={0} iconSize={32} />
      </div>

      <div style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={function () { props.onOpenDetail(ex); }}>
          <p style={{ color: C.white, fontSize: 14, fontWeight: 700, margin: "0 0 4px", textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.6 : 1 }}>
            {ex.name}
          </p>
          <p style={{ color: C.silverDim, fontSize: 12.5, margin: "0 0 6px" }}>{ex.sets} series x {ex.reps} reps</p>
          {ex.weight != null ? (
            <p style={{ color: C.silverDim, fontSize: 11.5, margin: "0 0 8px" }}>
              Carga planejada: <span style={{ color: C.weightBlue, fontWeight: 700 }}>{ex.weight}KG</span>
            </p>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={function (e) { e.stopPropagation(); }}>
            <label style={{ color: C.silverDim, fontSize: 12 }}>Carga usada</label>
            <input
              type="number" inputMode="decimal" placeholder="0"
              value={currentWeightValue}
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

function LockedExerciseCard(props) {
  var ex = props.ex;

  return (
    <div
      onClick={function () { props.onOpenDetail(ex); }}
      style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 14, overflow: "hidden", cursor: "pointer", opacity: 0.9 }}
    >
      <div style={{ width: "100%", height: 140, position: "relative" }}>
        <ImageThumb src={ex.image} alt={ex.name} size="100%" radius={0} iconSize={30} />
        <div style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LockIcon size={13} color={C.silverDim} />
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <p style={{ color: C.white, fontSize: 13.5, fontWeight: 700, margin: "0 0 3px" }}>{ex.name}</p>
        <p style={{ color: C.silverDim, fontSize: 12, margin: 0 }}>{ex.sets} series x {ex.reps} reps</p>
        {ex.weight != null ? (
          <p style={{ color: C.silverDim, fontSize: 11.5, margin: "3px 0 0" }}>
            Carga planejada: <span style={{ color: C.weightBlue, fontWeight: 700 }}>{ex.weight}KG</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

// Titulo simples de categoria (prata, pequeno, caixa alta) usado para
// separar blocos de exercicios/grupos musculares (ex: "MEMBROS INFERIORES").
function CategoryHeading(props) {
  return (
    <p style={{ color: C.silverDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: props.first ? "0 0 10px" : "18px 0 10px" }}>
      {(props.title || DEFAULT_CATEGORY).toUpperCase()}
    </p>
  );
}

// Painel do aluno. So enxerga exercicios com is_published = true.
// Se o professor ainda esta editando (rascunho), o aluno ve "dia de
// descanso ou sem registro" -- exatamente como um dia realmente vazio.
function AlunoDashboard(props) {
  var student = props.student;
  var weekDays = buildWeekDays(new Date());
  var today = new Date();

  var stateAllExercises = useState([]); var allExercises = stateAllExercises[0]; var setAllExercises = stateAllExercises[1];
  var stateLoading = useState(true); var loading = stateLoading[0]; var setLoading = stateLoading[1];
  var stateWeights = useState({}); var weights = stateWeights[0]; var setWeights = stateWeights[1];
  var stateFinishing = useState(false); var finishing = stateFinishing[0]; var setFinishing = stateFinishing[1];
  var stateFinishError = useState(""); var finishError = stateFinishError[0]; var setFinishError = stateFinishError[1];
  var stateHistoryRecords = useState([]); var historyRecords = stateHistoryRecords[0]; var setHistoryRecords = stateHistoryRecords[1];
  var statePhrase = useState(pickRandomPhrase); var phrase = statePhrase[0];
  var stateForceView = useState(false); var forceView = stateForceView[0]; var setForceView = stateForceView[1];
  var stateDetailEx = useState(null); var detailEx = stateDetailEx[0]; var setDetailEx = stateDetailEx[1];
  var stateStarting = useState(false); var starting = stateStarting[0]; var setStarting = stateStarting[1];
  var stateShowMonthly = useState(false); var showMonthly = stateShowMonthly[0]; var setShowMonthly = stateShowMonthly[1];

  var stateStartedAt = useState(student.workout_started_at || null);
  var startedAt = stateStartedAt[0]; var setStartedAt = stateStartedAt[1];

  var stateSelectedDate = useState(function () {
    for (var i = 0; i < weekDays.length; i++) { if (isSameDate(weekDays[i], today)) return weekDays[i]; }
    return weekDays[0];
  });
  var selectedDate = stateSelectedDate[0]; var setSelectedDate = stateSelectedDate[1];

  // So busca exercicios PUBLICADOS -- rascunhos do professor ficam invisiveis.
  async function fetchExercises() {
    var result = await supabase
      .from("exercises")
      .select("*")
      .eq("student_id", student.id)
      .eq("is_published", true)
      .order("created_at", { ascending: true });
    if (!result.error && result.data) setAllExercises(result.data);
    return result;
  }

  async function fetchHistory() {
    var result = await supabase.from("workout_history").select("*").eq("student_id", student.id).order("created_at", { ascending: false });
    if (!result.error && result.data) setHistoryRecords(result.data);
    return result;
  }

  useEffect(function () {
    var cancelled = false;
    async function initialLoad() {
      setLoading(true);
      await fetchExercises();
      await fetchHistory();
      if (!cancelled) setLoading(false);
    }
    initialLoad();
    return function () { cancelled = true; };
  }, [student.id]);

  if (showMonthly) {
    return (
      <MonthlyHistoryScreen
        studentName={student.name}
        historyRecords={historyRecords}
        onClose={function () { setShowMonthly(false); }}
      />
    );
  }

  function selectDate(d) {
    setSelectedDate(d);
    setForceView(false);
  }

  var isToday = isSameDate(selectedDate, today);
  var isPast = stripTime(selectedDate).getTime() < stripTime(today).getTime();
  var selectedDayKey = getDayKeyForDate(selectedDate);
  var plannedList = allExercises.filter(function (e) { return e.scheduled_day === selectedDayKey; });
  var groupedPlannedList = groupByCategory(plannedList);
  var historyForSelectedDate = findHistoryForDate(historyRecords, selectedDate);

  var startedAtIsToday = startedAt ? isSameDate(new Date(startedAt), today) : false;
  var hasAnyCompletedToday = plannedList.some(function (e) { return !!e.is_completed; });
  var isInteractive = isToday && (startedAtIsToday || hasAnyCompletedToday);

  function toggle(ex) {
    var newValue = !ex.is_completed;
    setAllExercises(function (prev) {
      return prev.map(function (e) { return e.id === ex.id ? Object.assign({}, e, { is_completed: newValue }) : e; });
    });

    supabase
      .from("exercises")
      .update({ is_completed: newValue })
      .eq("id", ex.id)
      .eq("student_id", student.id)
      .select()
      .then(function (result) {
        if (result.error || !result.data || result.data.length === 0) {
          setAllExercises(function (prev) {
            return prev.map(function (e) { return e.id === ex.id ? Object.assign({}, e, { is_completed: !newValue }) : e; });
          });
        }
      });
  }

  function setWeight(exId, val) {
    var key = student.id + "-" + selectedDayKey + "-" + exId;
    setWeights(function (prev) {
      var next = Object.assign({}, prev);
      next[key] = val;
      return next;
    });
  }

  async function startWorkout() {
    setStarting(true);
    var nowIso = new Date().toISOString();
    var result = await supabase.from("profiles").update({ workout_started_at: nowIso }).eq("id", student.id).select();
    setStarting(false);
    if (!result.error) {
      setStartedAt(nowIso);
    }
  }

  async function resetTodayWorkoutSilently(exIds) {
    if (exIds.length === 0) return;
    await supabase.from("exercises").update({ is_completed: false }).in("id", exIds).select();
    await fetchExercises();
  }

  async function resetStartedFlag() {
    var result = await supabase.from("profiles").update({ workout_started_at: null }).eq("id", student.id).select();
    if (!result.error) {
      setStartedAt(null);
    }
  }

  // Deduplicacao: upsert por (student_id, workout_date). O peso final de
  // cada exercicio (o que o aluno digitou, ou o planejado se nao alterou)
  // e capturado no snapshot salvo em summary_data.
  async function finishWorkout() {
    if (finishing) return;
    setFinishing(true);
    setFinishError("");

    var list = plannedList;
    var snapshot = list.map(function (ex) {
      var key = student.id + "-" + selectedDayKey + "-" + ex.id;
      var finalWeight = weights[key] !== undefined ? weights[key] : (ex.weight != null ? ex.weight : null);
      return {
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        completed: !!ex.is_completed,
        weight: finalWeight,
      };
    });

    var todayDateStr = toDateOnlyString(today);

    var writeResult = await supabase
      .from("workout_history")
      .upsert(
        [{
          student_id: student.id,
          workout_date: todayDateStr,
          summary_data: snapshot,
          created_at: new Date().toISOString(),
        }],
        { onConflict: "student_id,workout_date" }
      )
      .select();

    setFinishing(false);

    if (writeResult.error) {
      setFinishError("Nao foi possivel salvar o treino: " + writeResult.error.message);
      return;
    }

    if (writeResult.data && writeResult.data[0]) {
      var savedRecord = writeResult.data[0];
      setHistoryRecords(function (prev) {
        var withoutOld = prev.filter(function (r) { return r.id !== savedRecord.id; });
        return [savedRecord].concat(withoutOld);
      });
    }

    setForceView(false);

    var idsToReset = list.map(function (ex) { return ex.id; });
    resetTodayWorkoutSilently(idsToReset);
    resetStartedFlag();
  }

  var doneCount = 0;
  for (var j = 0; j < plannedList.length; j++) { if (plannedList[j].is_completed) doneCount++; }

  var weekCircleItems = weekDays.map(function (d, i) {
    var hasHist = !!findHistoryForDate(historyRecords, d);
    var dIsToday = isSameDate(d, today);
    var highlighted = hasHist || dIsToday;
    var color = hasHist ? C.success : C.blue;
    return {
      key: DAY_TABS[i].key,
      topLabel: DAY_TABS[i].label,
      circleText: d.getDate(),
      highlighted: highlighted,
      highlightColor: color,
      ringActive: isSameDate(d, selectedDate),
      onClick: function () { selectDate(d); },
    };
  });

  var showCompletedView = historyForSelectedDate && !forceView && !loading;
  var sectionTitle = getSectionTitle(isPast, isToday, selectedDayKey);

  return (
    <PageContainer>
      <TopBrandBar />

      <PressableProfileHeader
        name={student.name}
        title={"Treino de " + student.name.split(" ")[0]}
        subtitle={
          <React.Fragment>
            <Phone size={11} /> {student.phone}
          </React.Fragment>
        }
        onClick={function () { setShowMonthly(true); }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={props.onExit} aria-label="Sair" style={{ marginTop: -34, width: 34, height: 34, borderRadius: 8, border: "1px solid " + C.border, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <LogOut size={16} color={C.silverDim} />
        </button>
      </div>

      <div style={{ paddingTop: 20, marginBottom: 6 }}>
        <p style={{ color: C.silverDim, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
          Minha Semana
        </p>
        <WeekCircleRow items={weekCircleItems} />
      </div>

      <p style={{ color: C.silverDim, fontSize: 12, margin: "10px 0 16px" }}>
        {formatFriendlyDate(selectedDate)}
      </p>

      {loading ? (
        <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Carregando...</p>
      ) : showCompletedView ? (
        <CompletedDayView
          record={historyForSelectedDate}
          allRecords={historyRecords}
          phrase={isToday ? phrase : null}
          onViewPlan={isToday ? function () { setForceView(true); } : null}
        />
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Flame size={16} color={C.blue} />
            <h2 style={{ color: C.white, fontSize: 16, fontWeight: 800, margin: 0 }}>
              {sectionTitle}
            </h2>
          </div>

          {isInteractive ? <ProgressBar done={doneCount} total={plannedList.length} /> : null}

          {plannedList.length === 0 ? (
            <RestOrNoRecordMessage />
          ) : (
            <div>
              {groupedPlannedList.map(function (group, gIdx) {
                return (
                  <div key={group.category}>
                    <CategoryHeading title={group.category} first={gIdx === 0} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {group.items.map(function (ex) {
                        if (isInteractive) {
                          return (
                            <ExerciseCard
                              key={ex.id}
                              ex={ex}
                              weight={weights[student.id + "-" + selectedDayKey + "-" + ex.id]}
                              onToggle={toggle}
                              onWeightChange={setWeight}
                              onOpenDetail={setDetailEx}
                            />
                          );
                        }
                        return <LockedExerciseCard key={ex.id} ex={ex} onOpenDetail={setDetailEx} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {finishError ? (
            <p style={{ color: C.danger, fontSize: 12.5, marginTop: 10, textAlign: "center" }}>{finishError}</p>
          ) : null}

          {isToday && plannedList.length > 0 && !isInteractive ? (
            <button
              onClick={startWorkout}
              disabled={starting}
              style={{ width: "100%", marginTop: 18, background: C.blue, border: "none", borderRadius: 10, color: C.white, fontSize: 14, fontWeight: 700, padding: "13px 0", cursor: "pointer", opacity: starting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {starting ? <Spinner size={16} /> : <Play size={16} />}
              {starting ? "Iniciando..." : "Iniciar Treino de Hoje"}
            </button>
          ) : null}

          {isToday && isInteractive ? (
            <button
              onClick={finishWorkout}
              disabled={finishing}
              style={{ width: "100%", marginTop: 18, background: C.blue, border: "none", borderRadius: 10, color: C.white, fontSize: 14, fontWeight: 700, padding: "13px 0", cursor: "pointer", opacity: finishing ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {finishing ? <Spinner size={16} /> : <Flame size={16} />}
              {finishing ? "Salvando..." : "Finalizar Treino"}
            </button>
          ) : null}

          {forceView ? (
            <button
              onClick={function () { setForceView(false); }}
              style={{ width: "100%", marginTop: 10, background: "transparent", border: "1px solid " + C.border, borderRadius: 8, color: C.silverDim, fontSize: 12.5, fontWeight: 600, padding: "9px 0", cursor: "pointer" }}
            >
              Voltar para Treino Finalizado
            </button>
          ) : null}
        </div>
      )}

      {detailEx ? <ExerciseDetailModal ex={detailEx} onClose={function () { setDetailEx(null); }} /> : null}
    </PageContainer>
  );
}

// Linha de exercicio no painel do professor (planejamento do dia).
// Inclui Carga (weight) e Categoria (category). Sem etiqueta A/B/C.
// Os campos de foto agora aceitam ficar vazios (bug de nao poder apagar corrigido).
function ProfessorExerciseRow(props) {
  var ex = props.ex;
  var stateEditing = useState(false); var editing = stateEditing[0]; var setEditing = stateEditing[1];
  var stateName = useState(ex.name); var name = stateName[0]; var setName = stateName[1];
  var stateSets = useState(String(ex.sets)); var sets = stateSets[0]; var setSets = stateSets[1];
  var stateReps = useState(ex.reps); var reps = stateReps[0]; var setReps = stateReps[1];
  var stateWeight = useState(ex.weight != null ? String(ex.weight) : ""); var weight = stateWeight[0]; var setWeight = stateWeight[1];
  var stateCategory = useState(ex.category || ""); var category = stateCategory[0]; var setCategory = stateCategory[1];
  var stateImage = useState(ex.image || ""); var image = stateImage[0]; var setImage = stateImage[1];
  var stateImage2 = useState(ex.image2 || ""); var image2 = stateImage2[0]; var setImage2 = stateImage2[1];
  var stateNotes = useState(ex.notes || ""); var notes = stateNotes[0]; var setNotes = stateNotes[1];

  function cancelEdit() {
    setName(ex.name);
    setSets(String(ex.sets));
    setReps(ex.reps);
    setWeight(ex.weight != null ? String(ex.weight) : "");
    setCategory(ex.category || "");
    setImage(ex.image || "");
    setImage2(ex.image2 || "");
    setNotes(ex.notes || "");
    setEditing(false);
  }

  // Campos de imagem: string vazia vira null explicitamente no banco --
  // permite ao professor APAGAR um link de foto ja cadastrado.
  function saveEdit() {
    if (!name.trim()) return;
    var trimmedImage = image.trim();
    var trimmedImage2 = image2.trim();
    props.onSave(ex.id, {
      name: name.trim(),
      sets: Number(sets) || 1,
      reps: reps.trim() || "-",
      weight: weight.trim() !== "" ? Number(weight.replace(",", ".")) : null,
      category: category.trim() || null,
      image: trimmedImage === "" ? null : trimmedImage,
      image2: trimmedImage2 === "" ? null : trimmedImage2,
      notes: notes.trim() || null,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div style={{ background: C.panelAlt, border: "1px solid " + C.blueDim, borderRadius: 12, padding: 12 }}>
        <input type="text" placeholder="Nome do exercicio" value={name} onChange={function (e) { setName(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <input type="text" placeholder="Categoria (ex: Membros Inferiores)" value={category} onChange={function (e) { setCategory(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input type="number" placeholder="Series" value={sets} onChange={function (e) { setSets(e.target.value); }} style={Object.assign({}, plainInputStyle, { width: 70 })} />
          <input type="text" placeholder="Repeticoes" value={reps} onChange={function (e) { setReps(e.target.value); }} style={Object.assign({}, plainInputStyle, { flex: 1 })} />
          <input type="number" placeholder="Carga (kg)" value={weight} onChange={function (e) { setWeight(e.target.value); }} style={Object.assign({}, plainInputStyle, { width: 90 })} />
        </div>
        <input type="text" placeholder="URL da foto 1 (deixe vazio para remover)" value={image} onChange={function (e) { setImage(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <input type="text" placeholder="URL da foto 2 (deixe vazio para remover)" value={image2} onChange={function (e) { setImage2(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <textarea placeholder="Observacoes Tecnicas" value={notes} onChange={function (e) { setNotes(e.target.value); }} style={Object.assign({}, textareaStyle, { marginBottom: 10 })} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveEdit} style={{ flex: 1, background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 13, fontWeight: 700, padding: "9px 0", cursor: "pointer" }}>Salvar</button>
          <button onClick={cancelEdit} style={{ flex: 1, background: "transparent", border: "1px solid " + C.border, borderRadius: 8, color: C.silverDim, fontSize: 13, fontWeight: 700, padding: "9px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <X size={14} /> Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.panel, border: "1px solid " + C.border, borderRadius: 12, padding: "10px 12px" }}>
      <ImageThumb src={ex.image} alt={ex.name} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: C.white, fontSize: 13.5, fontWeight: 700, margin: 0 }}>{ex.name}</p>
        <p style={{ color: C.silverDim, fontSize: 12, margin: 0 }}>
          {ex.sets} series x {ex.reps} reps
          {ex.weight != null ? <span style={{ color: C.weightBlue, fontWeight: 700 }}> - {ex.weight}KG</span> : null}
        </p>
        {ex.notes ? <p style={{ color: C.silverDim, fontSize: 11, margin: "2px 0 0", fontStyle: "italic" }}>{ex.notes}</p> : null}
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

function RecentHistoryList(props) {
  if (props.loading) {
    return <p style={{ color: C.silverDim, fontSize: 12.5, margin: "0 0 16px" }}>Carregando historico...</p>;
  }
  if (props.records.length === 0) {
    return <p style={{ color: C.silverDim, fontSize: 12.5, margin: "0 0 16px" }}>Nenhum treino concluido ainda.</p>;
  }
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <p style={{ color: C.silverDim, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>Ultimos Treinos Concluidos</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {props.records.slice(0, 5).map(function (r) {
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.panel, border: "1px solid " + C.border, borderRadius: 8, padding: "8px 10px" }}>
              <span style={{ color: C.white, fontSize: 12.5, fontWeight: 700 }}>Treino concluido</span>
              <span style={{ color: C.silverDim, fontSize: 11.5 }}>{formatFriendlyDate(r.created_at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Linha de um item da Biblioteca Geral, com edicao inline de Nome,
// Categoria, URL da foto 1 e URL da foto 2 -- campos aceitam ficar vazios.
function LibraryItemRow(props) {
  var it = props.item;
  var stateEditing = useState(false); var editing = stateEditing[0]; var setEditing = stateEditing[1];
  var stateName = useState(it.name); var name = stateName[0]; var setName = stateName[1];
  var stateCategory = useState(it.category || ""); var category = stateCategory[0]; var setCategory = stateCategory[1];
  var stateImage = useState(it.image || ""); var image = stateImage[0]; var setImage = stateImage[1];
  var stateImage2 = useState(it.image2 || ""); var image2 = stateImage2[0]; var setImage2 = stateImage2[1];
  var stateSaving = useState(false); var saving = stateSaving[0]; var setSaving = stateSaving[1];

  function cancelEdit() {
    setName(it.name);
    setCategory(it.category || "");
    setImage(it.image || "");
    setImage2(it.image2 || "");
    setEditing(false);
  }

  async function saveEdit() {
    if (!name.trim()) return;
    setSaving(true);
    var trimmedImage = image.trim();
    var trimmedImage2 = image2.trim();
    await props.onSave(it.id, {
      name: name.trim(),
      category: category.trim() || null,
      image: trimmedImage === "" ? null : trimmedImage,
      image2: trimmedImage2 === "" ? null : trimmedImage2,
    });
    setSaving(false);
    setEditing(false);
  }

  if (editing) {
    return (
      <div style={{ background: C.panelAlt, border: "1px solid " + C.blueDim, borderRadius: 12, padding: 12 }}>
        <input type="text" placeholder="Nome do exercicio" value={name} onChange={function (e) { setName(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <input type="text" placeholder="Categoria (ex: Membros Inferiores)" value={category} onChange={function (e) { setCategory(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <input type="text" placeholder="URL da foto 1 (deixe vazio para remover)" value={image} onChange={function (e) { setImage(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <input type="text" placeholder="URL da foto 2 (deixe vazio para remover)" value={image2} onChange={function (e) { setImage2(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 10 })} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveEdit} disabled={saving} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 13, fontWeight: 700, padding: "9px 0", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? <Spinner size={13} /> : null}
            {saving ? "Salvando..." : "Salvar"}
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
      <ImageThumb src={it.image} alt={it.name} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: C.white, fontSize: 13, fontWeight: 700, margin: 0 }}>{it.name}</p>
      </div>
      <button onClick={function () { setEditing(true); }} aria-label="Editar na biblioteca" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid " + C.border, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <Pencil size={13} color={C.blue} />
      </button>
      <button onClick={function () { props.onDelete(it.id); }} aria-label="Excluir da biblioteca" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid " + C.border, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <Trash2 size={14} color={C.danger} />
      </button>
    </div>
  );
}

// Biblioteca Geral: cadastro, edicao (nome, categoria, fotos) e exclusao de
// exercicios reutilizaveis, exibidos agrupados por categoria.
function LibraryManager(props) {
  var stateItems = useState([]); var items = stateItems[0]; var setItems = stateItems[1];
  var stateLoading = useState(true); var loading = stateLoading[0]; var setLoading = stateLoading[1];
  var stateName = useState(""); var name = stateName[0]; var setName = stateName[1];
  var stateImage = useState(""); var image = stateImage[0]; var setImage = stateImage[1];
  var stateImage2 = useState(""); var image2 = stateImage2[0]; var setImage2 = stateImage2[1];
  var stateCategory = useState(""); var category = stateCategory[0]; var setCategory = stateCategory[1];
  var stateSaving = useState(false); var saving = stateSaving[0]; var setSaving = stateSaving[1];

  async function loadItems() {
    setLoading(true);
    var result = await supabase.from("exercise_library").select("*").order("created_at", { ascending: false });
    if (!result.error && result.data) setItems(result.data);
    setLoading(false);
  }

  useEffect(function () { loadItems(); }, []);

  async function addItem() {
    if (!name.trim()) return;
    setSaving(true);
    var result = await supabase.from("exercise_library").insert([
      { name: name.trim(), image: image.trim() || null, image2: image2.trim() || null, category: category.trim() || null },
    ]).select();
    setSaving(false);
    if (!result.error && result.data) {
      setItems(function (prev) { return result.data.concat(prev); });
      setName("");
      setImage("");
      setImage2("");
      setCategory("");
    }
  }

  async function saveEditItem(id, updates) {
    var result = await supabase.from("exercise_library").update(updates).eq("id", id).select();
    if (!result.error && result.data && result.data.length > 0) {
      var updatedRow = result.data[0];
      setItems(function (prev) { return prev.map(function (it) { return it.id === id ? updatedRow : it; }); });
    }
  }

  async function deleteItem(id) {
    var result = await supabase.from("exercise_library").delete().eq("id", id);
    if (!result.error) {
      setItems(function (prev) { return prev.filter(function (it) { return it.id !== id; }); });
    }
  }

  var groupedItems = groupByCategory(items);

  return (
    <PageContainer>
      <TopBrandBar />
      <button onClick={props.onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: C.silverDim, fontSize: 13, cursor: "pointer", marginBottom: 12 }}>
        <ArrowLeft size={15} /> Voltar
      </button>

      <p style={{ color: C.white, fontSize: 17, fontWeight: 800, margin: "0 0 4px" }}>Biblioteca Geral</p>
      <p style={{ color: C.silverDim, fontSize: 12.5, margin: "0 0 18px" }}>Cadastre e edite exercicios reutilizaveis para agilizar o planejamento.</p>

      <div style={{ background: C.panelAlt, border: "1px solid " + C.border, borderRadius: 12, padding: 12, marginBottom: 20 }}>
        <p style={{ color: C.silverDim, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Novo exercicio</p>
        <input type="text" placeholder="Nome do exercicio" value={name} onChange={function (e) { setName(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <input type="text" placeholder="Categoria (ex: Membros Inferiores)" value={category} onChange={function (e) { setCategory(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <input type="text" placeholder="URL da foto 1" value={image} onChange={function (e) { setImage(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
        <input type="text" placeholder="URL da foto 2" value={image2} onChange={function (e) { setImage2(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 10 })} />
        <button onClick={addItem} disabled={saving} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 13, fontWeight: 700, padding: "10px 0", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? <Spinner size={14} /> : <Plus size={15} />}
          {saving ? "Salvando..." : "Adicionar a Biblioteca"}
        </button>
      </div>

      {loading ? (
        <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center" }}>Carregando biblioteca...</p>
      ) : items.length === 0 ? (
        <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center" }}>Nenhum exercicio na biblioteca ainda.</p>
      ) : (
        <div>
          {groupedItems.map(function (group, gIdx) {
            return (
              <div key={group.category}>
                <CategoryHeading title={group.category} first={gIdx === 0} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {group.items.map(function (it) {
                    return (
                      <LibraryItemRow key={it.id} item={it} onSave={saveEditItem} onDelete={deleteItem} />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}

// Aviso de status de publicacao do dia selecionado: rascunho (amarelo/cinza)
// ou ja enviado ao aluno (verde), exibido acima do botao de envio.
function PublishStatusBanner(props) {
  if (props.hasExercises === false) return null;
  var isPublished = props.isPublished;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: isPublished ? "rgba(63,174,106,0.1)" : "rgba(201,154,63,0.1)",
        border: "1px solid " + (isPublished ? C.success : C.warning),
        borderRadius: 10, padding: "10px 12px", marginBottom: 12,
      }}
    >
      {isPublished ? <CheckCircle2 size={16} color={C.success} /> : <FileEdit size={16} color={C.warning} />}
      <p style={{ color: isPublished ? C.success : C.warning, fontSize: 12.5, fontWeight: 700, margin: 0 }}>
        {isPublished ? "Treino ja enviado ao aluno" : "Rascunho - ainda nao enviado ao aluno"}
      </p>
    </div>
  );
}

// Painel do professor: dia PASSADO -> so historico/mensagem, sem formulario.
// Dia de HOJE ou FUTURO -> planejamento normal, agrupado por categoria, com
// selecao da biblioteca agrupada via <optgroup> e botao de envio ao aluno.
function ProfessorPanel(props) {
  var stateMode = useState("students"); var mode = stateMode[0]; var setMode = stateMode[1];
  var stateStudents = useState([]); var students = stateStudents[0]; var setStudents = stateStudents[1];
  var stateLoadingStudents = useState(true); var loadingStudents = stateLoadingStudents[0]; var setLoadingStudents = stateLoadingStudents[1];

  var stateSelected = useState(null); var selectedStudent = stateSelected[0]; var setSelectedStudent = stateSelected[1];
  var stateAllExercises = useState([]); var allExercises = stateAllExercises[0]; var setAllExercises = stateAllExercises[1];
  var stateLoadingWorkout = useState(false); var loadingWorkout = stateLoadingWorkout[0]; var setLoadingWorkout = stateLoadingWorkout[1];
  var statePublishing = useState(false); var publishing = statePublishing[0]; var setPublishing = statePublishing[1];

  var stateHistoryRecords = useState([]); var historyRecords = stateHistoryRecords[0]; var setHistoryRecords = stateHistoryRecords[1];
  var stateLoadingHistory = useState(false); var loadingHistory = stateLoadingHistory[0]; var setLoadingHistory = stateLoadingHistory[1];
  var stateShowMonthly = useState(false); var showMonthly = stateShowMonthly[0]; var setShowMonthly = stateShowMonthly[1];

  var stateLibrary = useState([]); var library = stateLibrary[0]; var setLibrary = stateLibrary[1];

  var weekDays = buildWeekDays(new Date());
  var today = new Date();
  var stateSelectedDate = useState(function () {
    for (var i = 0; i < weekDays.length; i++) { if (isSameDate(weekDays[i], today)) return weekDays[i]; }
    return weekDays[0];
  });
  var selectedDate = stateSelectedDate[0]; var setSelectedDate = stateSelectedDate[1];

  var stateLibrarySelectId = useState(""); var librarySelectId = stateLibrarySelectId[0]; var setLibrarySelectId = stateLibrarySelectId[1];
  var stateName = useState(""); var newName = stateName[0]; var setNewName = stateName[1];
  var stateSets = useState("3"); var newSets = stateSets[0]; var setNewSets = stateSets[1];
  var stateReps = useState("10-12"); var newReps = stateReps[0]; var setNewReps = stateReps[1];
  var stateWeight = useState(""); var newWeight = stateWeight[0]; var setNewWeight = stateWeight[1];
  var stateCategory = useState(""); var newCategory = stateCategory[0]; var setNewCategory = stateCategory[1];
  var stateImage = useState(""); var newImage = stateImage[0]; var setNewImage = stateImage[1];
  var stateImage2 = useState(""); var newImage2 = stateImage2[0]; var setNewImage2 = stateImage2[1];
  var stateNotes = useState(""); var newNotes = stateNotes[0]; var setNewNotes = stateNotes[1];

  useEffect(function () {
    async function loadStudentsAndHistory() {
      setLoadingStudents(true);
      var studentsResult = await supabase.from("profiles").select("*").eq("role", "aluno");
      if (studentsResult.error || !studentsResult.data) {
        setLoadingStudents(false);
        return;
      }

      var historyResult = await supabase.from("workout_history").select("*").order("created_at", { ascending: false });

      var latestByStudent = {};
      if (!historyResult.error && historyResult.data) {
        for (var i = 0; i < historyResult.data.length; i++) {
          var row = historyResult.data[i];
          if (!latestByStudent[row.student_id]) latestByStudent[row.student_id] = row;
        }
      }

      var enriched = studentsResult.data.map(function (s) {
        return Object.assign({}, s, { _lastHistory: latestByStudent[s.id] || null });
      });

      setStudents(enriched);
      setLoadingStudents(false);
    }
    loadStudentsAndHistory();

    async function loadLibrary() {
      var result = await supabase.from("exercise_library").select("*").order("name", { ascending: true });
      if (!result.error && result.data) setLibrary(result.data);
    }
    loadLibrary();
  }, []);

  useEffect(function () {
    if (!selectedStudent) return;
    var cancelled = false;
    async function loadWorkoutAndHistory() {
      setLoadingWorkout(true);
      setLoadingHistory(true);

      var exercisesResult = await supabase.from("exercises").select("*").eq("student_id", selectedStudent.id).order("created_at", { ascending: true });
      var historyResult = await supabase.from("workout_history").select("*").eq("student_id", selectedStudent.id).order("created_at", { ascending: false });

      if (!cancelled) {
        if (!exercisesResult.error && exercisesResult.data) setAllExercises(exercisesResult.data);
        setLoadingWorkout(false);

        if (!historyResult.error && historyResult.data) setHistoryRecords(historyResult.data);
        setLoadingHistory(false);
      }
    }
    loadWorkoutAndHistory();
    return function () { cancelled = true; };
  }, [selectedStudent]);

  if (mode === "library") {
    return <LibraryManager onBack={function () { setMode("students"); }} />;
  }

  if (!selectedStudent) {
    return (
      <StudentPicker
        title={loadingStudents ? "Carregando alunos..." : "Selecione o aluno para planejar o treino"}
        onPick={function (s) {
          setSelectedStudent(s);
          setSelectedDate(function () {
            for (var i = 0; i < weekDays.length; i++) { if (isSameDate(weekDays[i], today)) return weekDays[i]; }
            return weekDays[0];
          }());
        }}
        onBack={props.onExit}
        onOpenLibrary={function () { setMode("library"); }}
        students={students}
      />
    );
  }

  if (showMonthly) {
    return (
      <MonthlyHistoryScreen
        studentName={selectedStudent.name}
        historyRecords={historyRecords}
        onClose={function () { setShowMonthly(false); }}
      />
    );
  }

  var isPastSelected = stripTime(selectedDate).getTime() < stripTime(today).getTime();
  var isTodaySelected = isSameDate(selectedDate, today);
  var selectedDayKey = getDayKeyForDate(selectedDate);
  var byDay = groupByDay(allExercises);
  var list = byDay[selectedDayKey];
  var groupedList = groupByCategory(list);
  var historyForSelectedDate = findHistoryForDate(historyRecords, selectedDate);
  var isCompletedDay = !!historyForSelectedDate;
  var canPlan = !isPastSelected;
  var sectionTitle = getSectionTitle(isPastSelected, isTodaySelected, selectedDayKey);

  // Status de publicacao do dia: so faz sentido se ha pelo menos 1 exercicio.
  var allPublished = list.length > 0 && list.every(function (ex) { return ex.is_published; });

  var weekCircleItems = weekDays.map(function (d, i) {
    var hasHist = !!findHistoryForDate(historyRecords, d);
    var dIsToday = isSameDate(d, today);
    var highlighted = hasHist || dIsToday;
    var color = hasHist ? C.success : C.blue;
    return {
      key: DAY_TABS[i].key,
      topLabel: DAY_TABS[i].label,
      circleText: d.getDate(),
      highlighted: highlighted,
      highlightColor: color,
      ringActive: isSameDate(d, selectedDate),
      onClick: function () { setSelectedDate(d); },
    };
  });

  // Biblioteca agrupada por categoria, para montar as <optgroup> do select.
  var libraryGroups = groupByCategory(library);

  function handleLibrarySelect(id) {
    setLibrarySelectId(id);
    if (!id) return;
    var item = library.find(function (it) { return it.id === id; });
    if (item) {
      setNewName(item.name);
      setNewCategory(item.category ? item.category : "");
      setNewImage(item.image || "");
      setNewImage2(item.image2 || "");
    }
  }

  async function addExercise() {
    if (!newName.trim()) return;

    var effectiveCategory = newCategory.trim();
    if (!effectiveCategory && librarySelectId) {
      var selectedLibItem = library.find(function (it) { return it.id === librarySelectId; });
      if (selectedLibItem && selectedLibItem.category) {
        effectiveCategory = selectedLibItem.category.trim();
      }
    }

    var payload = {
      student_id: selectedStudent.id,
      scheduled_day: selectedDayKey,
      name: newName.trim(),
      sets: Number(newSets) || 1,
      reps: newReps.trim() || "-",
      weight: newWeight.trim() !== "" ? Number(newWeight.replace(",", ".")) : null,
      category: effectiveCategory || null,
      image: newImage.trim() || null,
      image2: newImage2.trim() || null,
      notes: newNotes.trim() || null,
      is_published: false,
    };
    var result = await supabase.from("exercises").insert([payload]).select();
    if (!result.error && result.data) {
      setAllExercises(function (prev) { return prev.concat(result.data); });
      setLibrarySelectId("");
      setNewName("");
      setNewSets("3");
      setNewReps("10-12");
      setNewWeight("");
      setNewCategory("");
      setNewImage("");
      setNewImage2("");
      setNewNotes("");
    }
  }

  // Salvar uma edicao volta o exercicio para rascunho (is_published: false),
  // ate o professor clicar em "Enviar Planejamento ao Aluno" de novo.
  async function saveEditExercise(exId, updates) {
    var updatesWithDraft = Object.assign({}, updates, { is_published: false });
    var result = await supabase.from("exercises").update(updatesWithDraft).eq("id", exId).select();
    if (!result.error && result.data && result.data.length > 0) {
      var updatedRow = result.data[0];
      setAllExercises(function (prev) { return prev.map(function (e) { return e.id === exId ? updatedRow : e; }); });
    }
  }

  async function deleteExercise(exId) {
    var result = await supabase.from("exercises").delete().eq("id", exId);
    if (!result.error) {
      setAllExercises(function (prev) { return prev.filter(function (e) { return e.id !== exId; }); });
    }
  }

  // Publica todos os exercicios do dia selecionado de uma vez -- o aluno
  // so passa a enxergar esse dia depois deste clique.
  async function publishToday() {
    if (list.length === 0) return;
    setPublishing(true);
    var idsToPublish = list.map(function (ex) { return ex.id; });
    var result = await supabase.from("exercises").update({ is_published: true }).in("id", idsToPublish).select();
    setPublishing(false);
    if (!result.error && result.data) {
      var byId = {};
      result.data.forEach(function (row) { byId[row.id] = row; });
      setAllExercises(function (prev) { return prev.map(function (e) { return byId[e.id] || e; }); });
    }
  }

  return (
    <PageContainer>
      <TopBrandBar />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={function () { setSelectedStudent(null); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: C.silverDim, fontSize: 12.5, cursor: "pointer" }}>
          <ArrowLeft size={14} /> Trocar aluno
        </button>
        <button onClick={props.onExit} aria-label="Sair" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid " + C.border, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <LogOut size={16} color={C.silverDim} />
        </button>
      </div>

      <PressableProfileHeader
        name={selectedStudent.name}
        title={selectedStudent.name.split(" ")[0]}
        subtitle={"Painel do professor - " + selectedStudent.phone}
        onClick={function () { setShowMonthly(true); }}
      />

      <div style={{ paddingTop: 18 }}>
        <RecentHistoryList records={historyRecords} loading={loadingHistory} />
      </div>

      <div style={{ marginBottom: 6 }}>
        <p style={{ color: C.silverDim, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
          Semana do Aluno
        </p>
        <WeekCircleRow items={weekCircleItems} />
      </div>

      <p style={{ color: C.silverDim, fontSize: 12, margin: "10px 0 14px" }}>
        {formatFriendlyDate(selectedDate)}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <p style={{ color: isPastSelected ? C.success : C.blue, fontSize: 12.5, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {sectionTitle}
        </p>
      </div>

      {isCompletedDay ? (
        <CompletedDayView record={historyForSelectedDate} allRecords={historyRecords} />
      ) : isPastSelected ? (
        <RestOrNoRecordMessage />
      ) : (
        <div>
          <PublishStatusBanner isPublished={allPublished} hasExercises={list.length > 0} />

          {loadingWorkout ? (
            <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center", padding: "12px 0" }}>Carregando exercicios...</p>
          ) : list.length === 0 ? (
            <p style={{ color: C.silverDim, fontSize: 13, textAlign: "center", padding: "12px 0", marginBottom: 16 }}>Nenhum exercicio agendado para {DAY_FULL_LABEL[selectedDayKey]}. Adicione abaixo.</p>
          ) : (
            <div style={{ marginBottom: 16 }}>
              {groupedList.map(function (group, gIdx) {
                return (
                  <div key={group.category}>
                    <CategoryHeading title={group.category} first={gIdx === 0} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {group.items.map(function (ex) {
                        return (
                          <ProfessorExerciseRow key={ex.id} ex={ex} onSave={saveEditExercise} onDelete={deleteExercise} />
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={publishToday}
                disabled={publishing || allPublished}
                style={{
                  width: "100%", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: allPublished ? C.panelAlt : "linear-gradient(90deg, " + C.blue + ", " + C.blueDim + ")",
                  border: "1px solid " + (allPublished ? C.border : C.blueDim),
                  borderRadius: 10, color: allPublished ? C.silverDim : C.white, fontSize: 14, fontWeight: 800,
                  padding: "13px 0", cursor: allPublished ? "default" : "pointer", opacity: publishing ? 0.7 : 1,
                }}
              >
                {publishing ? <Spinner size={16} /> : <Rocket size={16} />}
                {publishing ? "Enviando..." : allPublished ? "Planejamento ja enviado" : "🚀 Enviar Planejamento ao Aluno"}
              </button>
            </div>
          )}

          {canPlan ? (
            <div style={{ background: C.panelAlt, border: "1px solid " + C.border, borderRadius: 12, padding: 12 }}>
              <p style={{ color: C.silverDim, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>
                Adicionar exercicio para {DAY_FULL_LABEL[selectedDayKey]}
              </p>

              <select value={librarySelectId} onChange={function (e) { handleLibrarySelect(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })}>
                <option value="">Selecionar da Biblioteca (opcional)</option>
                {libraryGroups.map(function (group) {
                  return (
                    <optgroup key={group.category} label={group.category}>
                      {group.items.map(function (it) {
                        return <option key={it.id} value={it.id}>{it.name}</option>;
                      })}
                    </optgroup>
                  );
                })}
              </select>

              <input type="text" placeholder="Nome do exercicio" value={newName} onChange={function (e) { setNewName(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
              <input type="text" placeholder="Categoria (ex: Membros Inferiores)" value={newCategory} onChange={function (e) { setNewCategory(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="number" placeholder="Series" value={newSets} onChange={function (e) { setNewSets(e.target.value); }} style={Object.assign({}, plainInputStyle, { width: 70 })} />
                <input type="text" placeholder="Repeticoes (ex: 10-12)" value={newReps} onChange={function (e) { setNewReps(e.target.value); }} style={Object.assign({}, plainInputStyle, { flex: 1 })} />
                <input type="number" placeholder="Carga (kg)" value={newWeight} onChange={function (e) { setNewWeight(e.target.value); }} style={Object.assign({}, plainInputStyle, { width: 90 })} />
              </div>
              <input type="text" placeholder="URL da foto 1" value={newImage} onChange={function (e) { setNewImage(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
              <input type="text" placeholder="URL da foto 2 (opcional)" value={newImage2} onChange={function (e) { setNewImage2(e.target.value); }} style={Object.assign({}, plainInputStyle, { marginBottom: 8 })} />
              <textarea placeholder="Observacoes Tecnicas" value={newNotes} onChange={function (e) { setNewNotes(e.target.value); }} style={Object.assign({}, textareaStyle, { marginBottom: 10 })} />

              <button onClick={addExercise} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: C.blue, border: "none", borderRadius: 8, color: C.white, fontSize: 13, fontWeight: 700, padding: "10px 0", cursor: "pointer" }}>
                <Plus size={15} /> Adicionar a {DAY_FULL_LABEL[selectedDayKey]}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </PageContainer>
  );
}

function App() {
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
      <ProfessorPanel selectedStudent={teacherStudent} onChangeStudent={setTeacherStudent} onExit={logout} />
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

export default App;
