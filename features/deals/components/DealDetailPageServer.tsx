import { notFound } from "next/navigation"

import { listDealActivitiesAction } from "@/features/activity/actions/activityActions"
import {
  getDealAction,
  listDealFormOptionsAction,
} from "@/features/deals/actions/dealActions"
import { DealDetailPage } from "@/features/deals/components/DealDetailPage"
import {
  emptyDealActivityData,
  emptyDealDeliverablesData,
  emptyDealFilesData,
  emptyDealNotesData,
  emptyDealTasksData,
} from "@/features/deals/utils/dealWorkspaceFallbacks"
import type { DealWorkspaceTab } from "@/features/deals/utils/dealWorkspaceTabs"
import { listDealDeliverablesAction } from "@/features/deliverables/actions/deliverableActions"
import { listDealFilesAction } from "@/features/files/actions/fileActions"
import { listDealNotesAction } from "@/features/notes/actions/noteActions"
import { listDealTasksAction } from "@/features/tasks/actions/taskActions"

type DealDetailPageServerProps = {
  dealId: string
  initialTab: DealWorkspaceTab
}

export async function DealDetailPageServer({
  dealId,
  initialTab,
}: DealDetailPageServerProps) {
  const [
    dealResult,
    optionsResult,
    activitiesResult,
    tasksResult,
    deliverablesResult,
    notesResult,
    filesResult,
  ] = await Promise.all([
    getDealAction(dealId),
    listDealFormOptionsAction(),
    initialTab === "activity"
      ? listDealActivitiesAction({ dealId })
      : Promise.resolve(null),
    initialTab === "tasks"
      ? listDealTasksAction({ dealId })
      : Promise.resolve(null),
    initialTab === "deliverables"
      ? listDealDeliverablesAction({ dealId })
      : Promise.resolve(null),
    initialTab === "notes"
      ? listDealNotesAction({ dealId })
      : Promise.resolve(null),
    initialTab === "files"
      ? listDealFilesAction({ dealId })
      : Promise.resolve(null),
  ])

  if (!dealResult.success || !optionsResult.success || !optionsResult.data) {
    notFound()
  }

  return (
    <DealDetailPage
      deal={dealResult.data}
      initialTab={initialTab}
      activityError={
        !activitiesResult || activitiesResult.success
          ? undefined
          : (activitiesResult.message ??
            "Could not load deal timeline activities.")
      }
      activityData={
        activitiesResult?.success && activitiesResult.data
          ? activitiesResult.data
          : emptyDealActivityData(dealId)
      }
      brands={optionsResult.data.brands}
      contacts={
        optionsResult.data.contactsByBrand[dealResult.data.brandId] ?? []
      }
      tasksError={
        !tasksResult || tasksResult.success
          ? undefined
          : (tasksResult.message ?? "Could not load deal tasks.")
      }
      tasksData={
        tasksResult?.success && tasksResult.data
          ? tasksResult.data
          : emptyDealTasksData()
      }
      deliverablesError={
        !deliverablesResult || deliverablesResult.success
          ? undefined
          : (deliverablesResult.message ?? "Could not load deal deliverables.")
      }
      deliverablesData={
        deliverablesResult?.success && deliverablesResult.data
          ? deliverablesResult.data
          : emptyDealDeliverablesData()
      }
      notesError={
        !notesResult || notesResult.success
          ? undefined
          : (notesResult.message ?? "Could not load deal notes.")
      }
      notesData={
        notesResult?.success && notesResult.data
          ? notesResult.data
          : emptyDealNotesData()
      }
      filesError={
        !filesResult || filesResult.success
          ? undefined
          : (filesResult.message ?? "Could not load deal files.")
      }
      filesData={
        filesResult?.success && filesResult.data
          ? filesResult.data
          : emptyDealFilesData()
      }
    />
  )
}
