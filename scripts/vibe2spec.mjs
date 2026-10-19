#!/usr/bin/env node
import {pathToFileURL} from 'node:url';
import {validate,createReport,formatReport,supportedRuntime} from './report.mjs';
import {finding} from './findings.mjs';
import {loadGraph} from './graph.mjs';
import {renderOverview} from './overview.mjs';
const help=`Vibe2Spec 0.1.0\n\nRead-only inspection:\n  node scripts/vibe2spec.mjs validate --workspace /absolute/workspace --entry relative/record.json --operation structure|implementation_readiness|lifecycle [--format json|readable]\n  node scripts/vibe2spec.mjs overview --workspace /absolute/workspace --entry relative/project.json\n\nBoth commands accept repeated --external-file /absolute/exact/file and --limit key=value.\nApproved limits and runtime requirements: docs/validation.md.\nReports do not replace user approval or separate review.\n`;
export function parseArguments(args) {
 if(args.length===1 && ['--help','-h'].includes(args[0])) return {help:true};
 const [command,...rest]=args;
 if(!['validate','overview'].includes(command)) throw new TypeError('invalid-operation');
 const out={command,externalFiles:[],limits:{},format:'json'}, seen=new Set();
 for(let i=0;i<rest.length;i+=2) {
  const key=rest[i],value=rest[i+1];
  if(!['--workspace','--entry','--operation','--format','--external-file','--limit'].includes(key) || typeof value!=='string') throw new TypeError('invalid-argument');
  if(!['--external-file','--limit'].includes(key) && seen.has(key)) throw new TypeError('invalid-argument');
  seen.add(key);
  if(key==='--external-file') out.externalFiles.push(value);
  else if(key==='--limit') {
   const match=/^([A-Za-z]+)=([1-9][0-9]*)(?![\s\S])/.exec(value);
   if(!match || Object.hasOwn(out.limits,match[1]) || !Number.isSafeInteger(Number(match[2]))) throw new TypeError('invalid-limits');
   out.limits[match[1]]=Number(match[2]);
  } else out[key.slice(2)]=value;
 }
 if(!out.workspace || !out.entry || !['json','readable'].includes(out.format)) throw new TypeError('invalid-argument');
 if(command==='validate' && !out.operation) throw new TypeError('invalid-operation');
 if(command==='overview' && (seen.has('--operation') || seen.has('--format'))) throw new TypeError('invalid-argument');
 return out;
}
export async function main(args=process.argv.slice(2),stdout=process.stdout,stderr=process.stderr) {
 let options;
 try {options=parseArguments(args);} catch(e) {
  const report=createReport({findings:[finding('invocation',['invalid-operation','invalid-limits'].includes(e.message)?e.message:'invalid-argument')]});
  stdout.write(formatReport(report));return report.exit_status;
 }
 if(options.help) {stdout.write(help);return 0;}
 if(options.command==='overview') {
  const report=await validate({...options,operation:'structure'});
  if(report.exit_status!==0) {stdout.write(formatReport(report));return report.exit_status;}
  const graph=await loadGraph(options);
  // Verify the second observation too; never render unvalidated changed content.
  if(!graph.complete || graph.findings.length || graph.entry_sha256!==report.entry_sha256) {
   const changed=createReport({operation:'structure',entry:options.entry,graph,findings:[...graph.findings,finding('incomplete','input-changed')]});
   stdout.write(formatReport(changed));return changed.exit_status;
  }
  try {stdout.write(renderOverview(graph.records.get(graph.entry),[...graph.records.values()]));return 0;} catch {
   const error=createReport({findings:[finding('invocation','invalid-argument')]});stdout.write(formatReport(error));return 3;
  }
 }
 const report=await validate(options);
 stdout.write(formatReport(report,options.format));return report.exit_status;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
 process.stdout.on('error',()=>{process.exitCode=4;try{process.stderr.write('Vibe2Spec report output failed.\n');}catch{}});
 main().then(code=>{if(process.exitCode!==4)process.exitCode=code;}).catch(()=>{process.exitCode=4;try{process.stderr.write('Vibe2Spec report output failed.\n');}catch{}});
}
