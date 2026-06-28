import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { listDealActivitiesAction } from "@/app/action/activityActions"
import { getDealAction, listDealFormOptionsAction } from "@/app/action/dealActions"
import { listDealDeliverablesAction } from "@/app/action/deliverableActions"
import { listDealFilesAction } from "@/app/action/fileActions"
import { listDealNotesAction } from "@/app/action/noteActions"
import { listDealTasksAction } from "@/app/action/taskActions"
import { DealDetailPageServer } from "@/components/modules/crm/deals/DealDetailPageServer"
import { isDealWorkspaceTab, type DealWorkspaceTab } from "@/lib/crm/deals/dealWorkspaceTabs"

type DashboardDealDetailPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    tab?: string
  }>
}

export async function generateMetadata({ params }: DashboardDealDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const dealResult = await getDealAction(id)
  if (!dealResult.success) {
    return { title: "Deal Details" }
  }
  return {
    title: `${dealResult.data.campaignName} · Deal Details`,
  }
}

export default async function DashboardDealDetailPage({ params, searchParams }: DashboardDealDetailPageProps) {
  const { id } = await params
  const search = await searchParams
  const initialTab: DealWorkspaceTab = isDealWorkspaceTab(search.tab) ? search.tab : "overview"

  const [dealResult, optionsResult, activitiesResult, tasksResult, deliverablesResult, notesResult, filesResult] = await Promise.all([
    getDealAction(id),
    listDealFormOptionsAction(),
    initialTab === "activity" ? listDealActivitiesAction({ dealId: id }) : Promise.resolve(null),
    initialTab === "tasks" ? listDealTasksAction({ dealId: id }) : Promise.resolve(null),
    initialTab === "deliverables" ? listDealDeliverablesAction({ dealId: id }) : Promise.resolve(null),
    initialTab === "notes" ? listDealNotesAction({ dealId: id }) : Promise.resolve(null),
    initialTab === "files" ? listDealFilesAction({ dealId: id }) : Promise.resolve(null),
  ])

  if (!dealResult.success || !optionsResult.success || !optionsResult.data) {
    notFound()
  }

  return (
    <DealDetailPageServer
      deal={dealResult.data}
      initialTab={initialTab}
      activityError={
        !activitiesResult || activitiesResult.success
          ? undefined
          : activitiesResult.message ?? "Could not load deal timeline activities."
      }
      activityData={
        activitiesResult?.success && activitiesResult.data
          ? activitiesResult.data
          : {
              items: [],
              pagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 1,
              },
              filters: {
                dealId: id,
              },
            }
      }
      brands={optionsResult.data.brands}
      contacts={optionsResult.data.contactsByBrand[dealResult.data.brandId] ?? []}
      tasksError={!tasksResult || tasksResult.success ? undefined : tasksResult.message ?? "Could not load deal tasks."}
      tasksData={
        tasksResult?.success && tasksResult.data
          ? tasksResult.data
          : {
              items: [],
              pagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 1,
              },
              filters: {
                search: "",
                archive: "active",
                dueDate: "all",
                sort: "order",
              },
              summary: {
                total: 0,
                completed: 0,
                upcoming: 0,
                overdue: 0,
                progress: 0,
              },
            }
      }
      deliverablesError={
        !deliverablesResult || deliverablesResult.success
          ? undefined
          : deliverablesResult.message ?? "Could not load deal deliverables."
      }
      deliverablesData={
        deliverablesResult?.success && deliverablesResult.data
          ? deliverablesResult.data
          : {
              items: [],
              pagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 1,
              },
              filters: {
                search: "",
                archive: "active",
                sort: "order",
              },
              summary: {
                total: 0,
                draft: 0,
                submitted: 0,
                needsRevision: 0,
                approved: 0,
                published: 0,
              },
            }
      }
      notesError={!notesResult || notesResult.success ? undefined : notesResult.message ?? "Could not load deal notes."}
      notesData={
        notesResult?.success && notesResult.data
          ? notesResult.data
          : {
              items: [],
              pagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 1,
              },
              filters: {
                search: "",
                archive: "active",
              },
            }
      }
      filesError={!filesResult || filesResult.success ? undefined : filesResult.message ?? "Could not load deal files."}
      filesData={
        filesResult?.success && filesResult.data
          ? filesResult.data
          : {
              items: [],
              pagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 1,
              },
              filters: {
                search: "",
                archive: "active",
              },
            }
      }
    />
  )
}
