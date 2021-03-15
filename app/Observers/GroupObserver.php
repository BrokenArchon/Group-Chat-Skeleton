<?php

namespace App\Observers;

use App\Models\Group;
use Illuminate\Support\Str;

/**
 * Adding extra actions for events of model.
 *
 * Class UserObserver
 * @package App\Observers
 */
class GroupObserver
{
    /**
     * Handle the Group "creating" event.
     *
     * @param  \App\Models\Group  $Group
     * @return void
     */
    public function creating(Group $group)
    {
        $group->room_id = Str::uuid()->toString();
    }
}
