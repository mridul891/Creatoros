"use client";

import { SponsorshipMode } from "@/enums/sponsorship";
import { DealModal } from "./DealModal";
import { PipelineHeader } from "./PipelineHeader";
import { PipelineKanban } from "./PipelineKanban";
import { PipelineStats } from "./PipelineStats";
import { PipelineTable } from "./PipelineTable";
import { usePipeline } from "./usePipeline";

export function PipelinePage() {
  const pipeline = usePipeline(SponsorshipMode.TABLE);

  return (
    <div className="w-full max-w-[1300px] px-9 py-7">
      {pipeline.modal && <DealModal state={pipeline.modal} onSave={pipeline.handleSave} onClose={pipeline.closeModal} />}

      <PipelineHeader
        viewMode={pipeline.viewMode}
        search={pipeline.uiState.search}
        onViewChange={pipeline.setViewMode}
        onSearchChange={pipeline.setSearch}
        onAddContent={() => pipeline.openCreateModal()}
      />

      <PipelineStats summary={pipeline.summary} />

      {pipeline.viewMode === SponsorshipMode.TABLE ? (
        <PipelineTable
          deals={pipeline.filteredDeals}
          onSelectDeal={(deal) => {
            pipeline.openDealPanel(deal.id);
            pipeline.openEditModal(deal);
          }}
          onStageChange={pipeline.handleStageChange}
          onPriorityChange={pipeline.handlePriorityChange}
        />
      ) : (
        <PipelineKanban
          deals={pipeline.filteredDeals}
          selectedId={pipeline.selectedId}
          selectedDeal={pipeline.selectedDeal}
          dragOverStage={pipeline.uiState.dragOverStage}
          onSelectDeal={pipeline.toggleDealPanel}
          onAdvance={pipeline.handleAdvance}
          onDelete={pipeline.handleDelete}
          onEdit={pipeline.openEditModal}
          onStageChange={pipeline.handleStageChange}
          onAddToStage={pipeline.openCreateModal}
          onDropToStage={pipeline.handleDropToStage}
          onDragOverStage={pipeline.onDragOverStage}
          onDragLeaveStage={pipeline.onDragLeaveStage}
          onDragStart={pipeline.onDragStart}
          onDragEnd={pipeline.onDragEnd}
          onClosePanel={pipeline.closePanel}
        />
      )}
    </div>
  );
}
