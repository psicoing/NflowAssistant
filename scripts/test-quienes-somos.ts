import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as icons from "lucide-react";
import ts from "typescript";
import { transformSync } from "esbuild";

// Exercise actual content without browsers, providers, patient data or database.
const source = fs.readFileSync("client/src/components/sections/quienes-somos-intro.tsx", "utf8");
const transformed = transformSync(source, {
  loader: "tsx", format: "cjs", jsx: "transform", jsxFactory: "React.createElement",
}).code;
const exports = {};
const context = { React, exports, module: { exports }, require: () => icons };
vm.runInNewContext(transformed, context);
const component = (context.module.exports as { default?: React.ComponentType }).default;
assert(component);
const html = renderToStaticMarkup(React.createElement(component));
assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
for (const required of [
  "Quiénes somos", "Profesional responsable", "COPC 7851", "E-17928705",
  "no sustituye la atención", "Licenciatura en Psicología",
  "Universitat Autònoma de Barcelona", "1989–1993", "Universitat de Girona",
  "1994–1995", "Psicofarmacología", "1988–1993", "Universitat Oberta de Catalunya",
  "Desde 2010", "UOC – Universitat de Barcelona", "2020–2021",
]) assert(html.includes(required), `Missing source-backed public information: ${required}`);
assert.equal((html.match(/Estudios en curso/g) || []).length, 2);
assert(!/drive\.google|patatas bravas|birra|E-17928702/.test(html));

// Check the real menu used by Header rather than the unused legacy SidebarMenu.
const menu = fs.readFileSync("client/src/components/ui/smooth-scroll-menu.tsx", "utf8");
const ast = ts.createSourceFile("menu.tsx", menu, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const statement = ast.statements.find(item => ts.isVariableStatement(item) &&
  item.declarationList.declarations.some(declaration => declaration.name.getText(ast) === "navigationGroups"));
assert(statement && ts.isVariableStatement(statement));
const declaration = statement.declarationList.declarations.find(item => item.name.getText(ast) === "navigationGroups");
assert(declaration?.initializer);
const groups = vm.runInNewContext(
  transformSync(`const groups = ${declaration.initializer.getText(ast)}; groups;`, { loader: "ts" }).code,
  { ...icons },
) as { items: { id: string; name: string; href?: string }[] }[];
const entries = groups.flatMap(group => group.items).filter(item => item.id === "quienes-somos");
assert.equal(entries.length, 1);
assert.equal(entries[0].name, "Quiénes somos");
assert.equal(entries[0].href, "/quienes-somos");
assert(fs.readFileSync("client/src/components/layout/header.tsx", "utf8").includes("<SmoothScrollMenu"));
const page = fs.readFileSync("client/src/pages/quienes-somos.tsx", "utf8");
assert(page.includes("<QuienesSomosIntro />"));
assert(!page.includes("<h1"));
assert(fs.readFileSync("client/src/App.tsx", "utf8").includes('path="/quienes-somos" component={QuienesSomosPage}'));
for (const name of ["founder-section", "professional-merit-section"]) {
  const text = fs.readFileSync(`client/src/components/sections/${name}.tsx`, "utf8");
  assert(text.includes("E-17928705"));
  assert(!text.includes("E-17928702"));
}
console.log("PASS: actual Who we are content, faithful education/status, active hamburger entry, route, heading and credential consistency. No external calls.");
