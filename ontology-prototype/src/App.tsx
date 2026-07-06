import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard, ModelingHome } from './pages/Dashboard'
import { ManualModeling } from './pages/ManualModeling'
import { AssistModeling } from './pages/AssistModeling'
import { EvolveModeling } from './pages/EvolveModeling'
import { RuleModeling } from './pages/RuleModeling'
import { LogicModeling } from './pages/LogicModeling'
import { ModelLibrary, ModelDetail } from './pages/ModelLibrary'
import { AuditCenter, AuditDetail } from './pages/AuditCenter'
import { DataAccess } from './pages/DataAccess'
import { DataAccessApi } from './pages/DataAccessApi'
import { DataAccessDatabase } from './pages/DataAccessDatabase'
import { PlazaHome, PlazaAssetDetail, PlazaUpload } from './pages/Plaza'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/modeling" element={<ModelingHome />} />
          <Route path="/modeling/data-access" element={<DataAccess />} />
          <Route path="/modeling/data-access/api" element={<DataAccessApi />} />
          <Route path="/modeling/data-access/database" element={<DataAccessDatabase />} />
          <Route path="/modeling/manual/:id" element={<ManualModeling />} />
          <Route path="/modeling/assist" element={<AssistModeling />} />
          <Route path="/modeling/evolve" element={<EvolveModeling />} />
          <Route path="/modeling/rule" element={<RuleModeling />} />
          <Route path="/modeling/logic" element={<LogicModeling />} />
          <Route path="/models/:type" element={<ModelLibrary />} />
          <Route path="/models/:type/:id" element={<ModelDetail />} />
          <Route path="/audit" element={<AuditCenter />} />
          <Route path="/audit/:id" element={<AuditDetail />} />
          <Route path="/plaza" element={<PlazaHome />} />
          <Route path="/plaza/tools" element={<PlazaHome />} />
          <Route path="/plaza/models" element={<PlazaHome />} />
          <Route path="/plaza/apps" element={<PlazaHome />} />
          <Route path="/plaza/asset/:type/:id" element={<PlazaAssetDetail />} />
          <Route path="/plaza/upload" element={<PlazaUpload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
